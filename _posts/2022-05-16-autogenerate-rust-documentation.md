---
layout: post
title: "Autogenerate Rust Documentation"
author: "Hisbaan Noorani"
tags: dev rust man shell
---

Man pages and shell completions can really put the finishing touches on an already great CLI app! And thankfully, when using the CLI argument parsing crate `clap`, they're super easy to generate.

# Why?

First, let's delve into why you would even want to put time into such a thing. Easily the biggest annoyance in my day-to-day is when I'm working with a tool that doesn't have good completions. I'm spoiled by good shell completions, so I'm left disappointed when I press `TAB` and nothing comes up. Even when I'm using a tool that I'm already very used to, it's still annoying not to have that extra bit of help.

> Is the flag `--new`, `--create`, `--init`, or something else entirely!?

Shell completions help to avoid that hassle. Just press `TAB` and you're on your way!

Thie segues us on to the next piece of this article, the humble *man page*. In this case, man stands for manual. The man page is a documentation standard used on nearly every unix-based system. It's super handy to anyone wishing to dig deeper into your program's functionality.

# How?

We'll be using `clap`, the defacto standard for command-line argument parsing in Rust. If you've written a CLI app in Rust, you've likely already used `clap` (it does have close to 57 million downloads...). I'll assume that you've already written a `clap` struct and it looks something like this,

```rust
#[derive(Parser)]
#[clap(author = "Hisbaan Noorani", version = "1.1.3", about = "Did You Mean: A cli spelling corrector", long_about = None)]
pub struct Cli {
    pub search_term: Option<String>,
    #[clap(
        short = 'n',
        long = "number",
        default_value_t = 5,
        help = "Change the number of matches printed",
        long_help = "Change the number of words the program will print. The default value is five."
    )]
    pub number: usize,
    #[clap(
        short = 'c',
        long = "clean-output",
        help = "Print clean output",
        long_help = "Print a clean version of the output without the title, numbers or colour."
    )]
    pub clean_output: bool,
    #[clap(
        short = 'v',
        long = "verbose",
        help = "Print verbose output",
        long_help = "Print verbose output including the edit distance of the found word to the queried word."
    )]
    pub verbose: bool,
    #[clap(
        short = 'y',
        long = "yank",
        help = "Yank (copy) to the system cliboard",
        long_help = "Yank (copy) the selected word to the system clipboard. If no word is selected, the clipboard will not be altered."
    )]
    pub yank: bool,
    #[clap(
        short = 'l',
        long = "lang",
        help = "Select the desired language using the locale code (en, fr, sp, etc.)",
        long_help = "Select the desired language using its locale code. For example, English would have the locale code en and French would have the locale code fr. See --print-langs for a list of locale codes and the corresponding languages.",
        default_value = "en"
    )]
    pub lang: String,
    #[clap(
        long = "print-langs",
        help = "Display a list of supported languages",
        long_help = "Display a list of supported languages and their respective locale codes."
    )]
    pub print_langs: bool,
    #[clap(
        long = "update-langs",
        help = "Update all language files",
        long_help = "Update all language files from the repository https://github.com/hisbaan/wordlists."
    )]
    pub update_langs: bool,
}
```

There are other ways to generate your `clap` arguments, but I've found this to be the least confusing and most convenient. If you need a guide on getting started with `clap`, check out [their documentation](https://docs.rs/clap/latest/clap/).

Next, I'd recommend refactoring your struct into its own file and referencing it in your main file. This will make some of the steps we have to take later on a whole lot easier. I've put mine into a file called `cli.rs`, and I reference it in the `main.rs` file like so:

```rust
pub mod cli;
use cli::Cli;
```

This `cli.rs` file must be adjacent to the `main.rs` file in the file hierarchy. Next, we'll create a `build.rs` file. This script will run during the build process and perform any additional actions you need to do. Note that, unlike the other `*.rs` files, we have to put this in the project root, adjacent to your `Cargo.toml` file.

```rust
// build.rs

// Essentially coppies the code in the `cli.rs` file here.
include!("src/cli.rs");

// The function that will run during the build process.
fn main() {
    // Our generation code will go here.
}
```

Also, add a `[build-dependencies]` section to your `Cargo.toml`. This works just like `[dependencies]`; however, it is for the `build.rs` file instead of your entire project.

And now we're ready to get started with the generation. As with most things, preparation is the hardest part!

A note before we begin, the path that the man page and shell completions are generated to causes some issues with publishing to `crates.io`. I'll add a solution as soon as I can figure one out. Currently, it's recommended to only generate build files in the path specified by the `OUT_DIR`  environment variable; however, those files can be difficult to locate in an installation script, so I've simply generated them in subdirectories of the project root.

## Generating Man Pages

To generate the man page, we basically just lean on the power of `clap`! We use the `clap_mangen` crate, so be sure to add it to the `[build-dependencies]` section of your `Cargo.toml`. There is very little for us to actually do. Add the following to your `build.rs`, modifying project-specific values as necessary.

```rust
///////////////////////////////
// Outside the main function //
///////////////////////////////

use clap_mangen::Man;
use clap::CommandFactory;

//////////////////////////////
// Inside the main function //
//////////////////////////////

// Get the directory to generate to.
let man_dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("man");

// Create the directory if it doesn't exist.
std::fs::create_dir_all(&man_dir).unwrap();

// Get information from your struct.
let mut cmd = Cli::command();
cmd.set_bin_name("dym");

// Generate the man page and write ti to the correct location.
let man = Man::new(cmd.to_owned());
let mut buffer: Vec<u8> = Default::default();
man.render(&mut buffer).expect("Man page generation failed");
std::fs::write(man_dir.join("dym.1"), buffer).expect("Failed to write man page");
```

And just like that, we're done! Go ahead and run `cargo build`, and you should see a new `man` directory generated with a shiny new man page file inside it. You can test it with `man --local-file man/name.1`

The path for installing man pages to your system, place them in the `/usr/share/man/man*/` folder with the permissions `644` where `*` is the category your man page falls into (notice the extension on the generated file):

- 1: User commands (executable programs or shell commands)
- 2: System calls (functions provided by the kernel)
- 3: Library calls (functions within program libraries)
- 4: Special files (usually found in `/dev`)
- 5: File formats and conventions e.g. `/etc/passwd`
- 6: Games
- 7: Miscellaneous (including macro packages and conventions),
- 8: System administration commands (usually only for root)
- 9: Kernel routines (Non-standard)

# Shell completions

There are a few different shells that the `clap_complete` crate supports. You can generate shell completions for `Bash`, `Elvish`, `Fish`, `Zsh`, and even `PowerShell`! We will be using the `clap_complete` crate so ensure it is in the `[build-dependencies]` section of your `Cargo.toml`. Place the following code in your `build.rs`, modifying project-specific values as necessary.

```rust
///////////////////////////////
// Outside the main function //
///////////////////////////////

use clap::CommandFactory;
use clap_complete::{
    generate_to,
    Shell::{Bash, Elvish, Fish, PowerShell, Zsh},
};

//////////////////////////////
// Inside the main function //
//////////////////////////////

// Get the directory to generate to.
let comp_dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("completions");

// Create the directory if it doesn't exist.
std::fs::create_dir_all(&comp_dir).unwrap();

// Generate shell completions.
for shell in [Bash, Elvish, Fish, PowerShell, Zsh] {
    generate_to(shell, &mut cmd, "dym", &comp_dir).unwrap();
}
```

After running a `cargo build`, you'll have a `completions` directory containing a few files. How you test and install these will differ depending on your shell of choice, but here are a few examples. After installing each of these, restart your shell, and the completions should work as they do with any other program.

### Bash

To test the file using Bash, simply source it. For example, `source completions/dym.bash`. The installation path may differ based on your distribution, but for Arch Linux, place the `dym.bash` file in the `/usr/share/bash-completion/completions/` directory with the permission `644`. By convention, the `.bash` suffix is removed from the file name, but that is not necessary for the completion to work.

### Fish

To test the file using Fish, simply source it. For example, `source completions/dym.fish`. The installation path may differ based on your distribution, but for Arch Linux, place the `dym.fish` file in the `/usr/share/fish/vendor_completions.d/` directory with the permission `644`.

### Zsh

To test the file using Zsh, run the command `compdef completions/_dym dym`. This is supposed to work, but I run into permission issues. The installation path may differ based on your distribution, but for Arch Linux, place the `_dym` file in the `/usr/share/zsh/site-functions/` directory with the permission `644`.

# Bringing it all together

Now that you have your man pages and shell completions generated make sure that you install them in any packages that you've created. If you need to know how to create a package, check out [my article regarding that](https://hisbaan.com/articles/2022-05-04-how-to-package-rust-applications). There are also tools like [cargo-aur](https://github.com/fosskers/cargo-aur) and [cargo-deb](https://github.com/kornelski/cargo-deb) that will make this process easier! Good luck on your journey, and shoot me a message if this article was helpful to you!
