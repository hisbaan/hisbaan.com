---
layout: post
title: "How to Package Rust Applications"
author: "Hisbaan Noorani"
tags: dev rust packaging
---
<!-- Copyright 2022 Hisbaan Noorani - All Rights Reserved -->

Packaging applications can be extremely specific, and messing up small details can have huge consequences for your users. In this article, I'll be going over how to package your Rust applications for [crates.io](https://crates.io), the [Archlinux User Repository (AUR)](https://aur.archlinux.org), and [Homebrew](https://brew.sh). The principles I discuss in this article can be applied to other packaging formats like an APT [Personal Package Archive (PPA)](https://help.launchpad.net/Packaging/PPA), [Fedora's Copr Repos](https://docs.pagure.org/copr.copr/screenshots_tutorial.html), or even a [Nixpkg](https://github.com/nixos/nixpkgs). Additionally, the article's contents can also be applied to applications written in other languages; packaging your application is not limited to stuff written in Rust. The only thing that would be different is some of the compile-time dependencies and some of the operations you perform in the respective build functions.

For the purposes of this article, I'll be using my application [didyoumean](https://github.com/hisbaan/didyoumean) as an example; check it out!

# Crates.io

Publishing your package to crates.io is the easiest and most accessible way to release your application to the public. It will allow your application to be installed by anyone running Linux, macOS, Windows, or any other operating system that `cargo`, the Rust package manager, supports. The caveat to this is that your user will have to have the entire Rust toolchain installed, which is often non-trivial for a non-tech-savvy user. Another caveat is that, unlike the other packaging standards here, crates.io will only accept applications written in Rust. Without further ado, let's get into it.

Before you write any build files, you need to link your `cargo` CLI utility to your `crates.io` account. If you don't already have a crates.io account, go ahead and create one. Then, grab the token from your account settings and link your `cargo` utility with your `crates.io` account with `cargo login <token>`.

You then need to add yourself as an owner by running `cargo owner --add <username>`.

The information that crates.io reads comes from your `Cargo.toml` configuration file. Some common entries include: `name`, `version`, `authors`, `license`, `description`, `readme`, `homepage`, `repository`, `keywords`, and `categories`.

```toml
[package]
# Your package name. This is what people will type in to install your application.
name = "didyoumean"
# The name of any authors in a comma-separated list.
authors = ["Hisbaan Noorani"]
# The package version. This needs to be incremented every time you publish.
version = "1.1.2"
# The Rust toolchain version your application targets.
edition = "2021"
# The license that your application is released under.
license = "GPL-3.0"
# A description of your application.
description = "A CLI spelling corrector"
# A link to the documentation of your application.
documentation = "https://docs.rs/packages/didyoumean"
# A link to the homepage for your application. This can be something like
# your website or your GitHub readme.
homepage = "https://github.com/hisbaan/didyoumean"
# A relative path to your README in the files your upload.
readme = "docs/README.md"
# A list of keywords associated with your app. These have a maximum length
# of x characters, and you can only have 5 of them.
keywords = ["levenshtein", "damerau", "edit-distance", "spelling"]
# A list of categories that apply to your app. These must come from the
# list [here](https://crates.io/category_slugs)
categories = ["command-line-utilities"]
```

There are other optional variables you can define listed [here](https://doc.rust-lang.org/cargo/reference/manifest.html).

You can then run `cargo package --list` to list all the files that will be published. If you're using `git` and there is something that you do not want to be included, then you can simply add this file to your `.gitignore` file or equivalent for other version control systems. You can also set up a variable if you're not using a version control system, which is described in the additional variables documentation I've linked above.

After this, I recommend you run `cargo clippy` to get some suggestions for common mistakes in your code. Then, run `cargo fmt` to automatically format your code according to the Rust formatting guidelines.

Then, you can run `cargo publish` to try and publish your application to crates.io. This will perform a test build of your application and ensure that everything in your `Cargo.toml` is valid. If everything is a-okay, `cargo` will publish your application to crates.io, and it will be accessible at `https://crates.io/packages/<package name>`.

Congrats! You've packaged your application for crates.io. A user can then install your package by running `cargo install <package name>`.

# Archlinux User Repository (AUR)

The AUR is an excellent repository for Archlinux and Archlinux-based Linux distributions. It has a smaller compatibility window than something like `crates.io`; however, the users are often more dedicated. It also supports binary packages meaning the user won't have to have your chosen language's build tools installed to install your application. I'll cover the three main kinds of packages in this section. There are stable packages, git packages, and binary packages.

Before publishing anything to the AUR, you must first create an account and add your public ssh key to your account.

If there is anything that you want to know more about `PKGBUILD` files or the process of publishing to the AUR, check out [this article](https://wiki.archlinux.org/title/PKGBUILD) on the Arch Wiki.

The following three sections cover why you would want to publish each kind of package and how to write the `PKGBUILD` file for each. There are common steps that will be covered after the three sections.


## Git packages

Git packages are intended to build the application from your latest git revision. This makes them inherently unstable, so these are not the preferred installation method for most users. They are, however, the easiest kind of AUR package to maintain as you can effectively 'set it and forget it.' They are given the suffix `-git` to differentiate them from stable and binary packages.

Clone the repository at `ssh://aur@aur.archlinux.org/<package name>-git`. You can then create a `PKGBUILD` file. If you are on an Arch-based distribution, you can run `cp /usr/share/pacman/PKGBUILD-vcs.proto PKGBUILD` to get a simple template. Then, perform the following steps.

1. Open the file and delete anything related to any version control system other than `git`.
1. Remove the comments at the top of the file, except for the `# Maintainer...` comment. Change this comment to your information.
1. Change the `pkgname` variable to your application name followed by the `-git` suffix.
1. Change the `pkgver` variable to your package version.
1. Change the `pkgdesc` variable to describe what your application does. This should ideally be just one sentence.
1. Add compatible architectures to a space-separated list of strings. This list should only contain valid architecture strings. An example of this variable could be:

    ```
    arch=('i686' 'pentium4' 'x86_64' 'arm' 'armv7h' 'armv6h' 'aarch64')
    ```

1. Change the `url` variable to the `https` URL of your `git` remote. An example of this would be `https://github.com/hisbaan/didyoumean`.
1. Add your license(s) to the `license` variable. For the GPLv3.0 license, use `GPL3`.
1. Add your application's runtime dependencies to the `dependencies` variable. Most Rust applications built against GNU utils will depend on `gcc-libs`.
1. Add your application's build dependencies to the `makedepends` variable. This will definitely include `git` and `cargo` but may include more.
1. If needed, add the `optdepends` variable. This is used to define optional dependencies for certain features. It is structured as follows:

    ```
    optdepends=('libxcb: X11 clipboard support'
                'wl-clipboard: Wayland clipboard support')
    ```

1. Replace `VCS` in the `provides` and `conflicts` variables with `git`.
1. If you are publishing a fork of another application, add that application's package to the `replaces` variable, so your package takes precedent over the package you are replacing.
1. `backup` is for preserving user-made changes to a package. It is primarily intended for any configuration files in `/etc`. For example, `/etc/pacman.conf`. You can find more information about it [here](https://wiki.archlinux.org/title/PKGBUILD#backup).
1. Unless you need them, remove the `options` and `install` variables.
1. Change the `source` variable to `git+<your git url>`. Since we defined the `url` variable above, we could also simply define this as `git+${url}`.
1. Remove the `noextract` and `md5sums` variables.
1. Add the `sha256sums` variable with the value `sha256sums=('SKIP')`. We only skip this check since this is a `git` package, and we do not need to verify the authenticity of these files because of `git`'s mechanisms.
1. In the `pkgver` function, replace the code present with the following if you have annotated tags as tied to your releases,

    ```bash
    pkgver() {
    	cd "$srcdir/${pkgname%-VCS}"
    	printf "%s" "$(git describe --long | sed 's/\([^-]*-\)g/r\1/;s/-/./g')"
    }
    ```

    Or the following if you do not

    ```bash
    pkgver() {
    	cd "$srcdir/${pkgname%-VCS}"
    	printf "r%s.%s" "$(git rev-list --count HEAD)" "$(git rev-parse --short HEAD)"
    }
    ```

    As the comment in the initial function states, these are not absolute commands and need to be adapted to your git repository based on what information is available. The purpose of this function is to update the package version during installation to detect if the version you have installed is newer or older than the version present on the AUR.
1. Replace the contents of the `prepare` function with

    ```bash
    prepare() {
        export RUSTUP_TOOLCHAIN=stable
        export CARGO_TARGET_DIR=target

        cd "$srcdir/${pkgname%-git}"
        cargo fetch --locked --target "$CARCH-unknown-linux-gnu"
    }
    ```

    This will fetch the dependencies required for the rest of the installation to be offline. This is good practice but is not strictly needed. If you do not want to do this, you will have to modify the `cargo build` command in the `build` function in the next step.
1. Replace the contents of the `build` function with

    ```bash
    build() {
        export RUSTUP_TOOLCHAIN=stable
        export CARGO_TARGET_DIR=target

        cd "$srcdir/${pkgname%-git}"
        cargo build --release --frozen
        strip target/release/${pkgname} # or the path to the binary
                                        # if it differs from your package name.
    }
    ```

    This will build the release build of your application and then reduce the binary side by removing unnecessary build information from the produced binary.
1. If you would like to, replace the contents of the `check` function to run your tests.

    ```bash
    check() {
        cd "$srcdir/${pkgname%-git}"
        export RUSTUP_TOOLCHAIN=stable
        export CARGO_TARGET_DIR=target
        cargo test --release --frozen
    }
    ```

    I do not do this in my packages as I have Github's CI/CD pipeline do the testing for me. The benefit of not including this is significantly reduced build times. Since Rust has a relatively slow build process, I don't include this in my packages.
1. Replace the contents of the `package` function with

    ```bash
    package() {
        cd "$srcdir/${pkgname%-git}"

        # replace ${pkgname} with the name of your binary if it differs from the package name.
        install -Dm755 target/release/${pkgname} -t "${pkgdir}/usr/bin/"

        # you do not need to install the license if it is present under `/usr/share/licenses/common/`.
        install -Dm644 LICENSE -t "${pkgdir}/usr/share/licenses/${pkgname%-git}/"
        install -Dm644 README.md -t "${pkgdir}/usr/share/doc/${pkgname%-git}/"
    }
    ```

    This will install the built binary to the system's binary directory and install the `LICENSE` and `README.md` files to their respective locations with the correct permissions.

And voila, you have finished writing the `PKGBUILD` file for your `-git` package. The following steps are testing it to ensure that you're not bricking people's machines with some bad commands.

For reference, my `PKGBUILD` for [`didyoumean-git`](https://aur.archlinux.org/packages/didyoumean-git) is as follows:

```bash
# Maintainer: Hisbaan Noorani <hisbaan@gmail.com>
pkgname=didyoumean-git
pkgver=1.1.2.r0.c2c4c10
pkgrel=1
pkgdesc="A CLI spelling corrector"
arch=('i686' 'pentium4' 'x86_64' 'arm' 'armv7h' 'armv6h' 'aarch64')
url="https://github.com/hisbaan/didyoumean"
license=('GPL3')
depends=('gcc-libs')
makedepends=('git' 'cargo' 'binutils')
optdepends=('libxcb: X11 clipboard support'
            'wl-clipboard: Wayland clipboard support')
provides=("${pkgname%-git}")
conflicts=("${pkgname%-git}")
source=('git+https://github.com/hisbaan/didyoumean')
sha256sums=('SKIP')

pkgver() {
	cd "$srcdir/${pkgname%-git}"
    printf "%s" "$(git describe --long | sed 's/v//;s/\([^-]*-\)g/r\1/;s/-/./g')"
}

prepare() {
    export RUSTUP_TOOLCHAIN=stable
    export CARGO_TARGET_DIR=target

    cd "$srcdir/${pkgname%-git}"
    cargo fetch --locked --target "$CARCH-unknown-linux-gnu"
}

build() {
    export RUSTUP_TOOLCHAIN=stable
    export CARGO_TARGET_DIR=target

    cd "$srcdir/${pkgname%-git}"
    cargo build --release --frozen
    strip target/release/dym
}

package() {
	cd "$srcdir/${pkgname%-git}"

    install -Dm755 target/release/dym -t "${pkgdir}/usr/bin/"

    install -Dm644 LICENSE -t "${pkgdir}/usr/share/licenses/${pkgname%-git}/"
    install -Dm644 docs/README.md -t "${pkgdir}/usr/share/doc/${pkgname%-git}/"
}
```

## Binary Packages

Binary packages are pre-built packages that a user can simply download and install. The benefit is that there is no build process, meaning that the user does not need to have the whole language toolchain installed nor deal with the overhead that building a package requires in terms of time and CPU usage. The `PKGBUILD` file for binary packages is the easiest to write but also the most work to maintain (especially if you are packaging binaries for multiple architectures). They are given the suffix `-bin` to distinguish themselves from the stable and git packages for the same application.

Clone the repository at `ssh://aur@aur.archlinux.org/<package name>-bin`. You can then create a `PKGBUILD` file. If you are on an Arch-based distribution, you can run `cp /usr/share/pacman/PKGBUILD.proto PKGBUILD` to get a simple template. Then, perform the following steps.

1. Remove the comments at the top of the file, except for the `# Maintainer...` comment. Change this comment to your information.
1. Change the `pkgname` variable to your application name followed by the `-bin` suffix.
1. Change the `pkgver` variable to your package version.
1. Change the `pkgrel` variable to indicate minor releases or bug fixes.
1. You can remove the `epoch` variable. This variable indicates changes even more minuscule than `pkgrel` denotes.
1. Change the `pkgdesc` variable to describe what your application does. This should ideally be just one sentence.
1. Add compatible architectures to a space-separated list of strings. This list should only contain valid architecture strings. An example of this variable could be:

    ```
    arch=('i686' 'pentium4' 'x86_64' 'arm' 'armv7h' 'armv6h' 'aarch64')
    ```

    However, for binary packages, you will usually only include one or maybe two of these.
1. Change the `url` variable to the `https` variable of your `git` remote. An example of this would be `https://github.com/hisbaan/didyoumean`.
1. Add your license(s) to the `license` variable. For the GPLv3.0 license, use `GPL3`.
1. Remove the `groups` variable.
1. Add your application's runtime dependencies to the `dependencies` variable. Most Rust applications built against GNU utils will depend on `gcc-libs`.
1. Remove the `makedepends` and `check depends` variables as this is a binary package, so there is no build process involved.
1. If needed, add the `optdepends` variable. This is used to define optional dependencies for certain features. It is structured as follows:

    ```
    optdepends=('libxcb: X11 clipboard support'
                'wl-clipboard: Wayland clipboard support')
    ```

1. Add your package name to the `provides`  and `conflicts` list variables.
1. If you are publishing a fork of another application, add that application's package to the `replaces` variable, so your package takes precedent over the package you are replacing.
1. `backup` is for preserving user-made changes to a package. It's primarily intended for any configuration files in `/etc`. For example, `/etc/pacman.conf`. You can find more information about it [here](https://wiki.archlinux.org/title/PKGBUILD#backup).
1. Unless you need them, remove the `options`, `install`, and `changelog` variables.
1. Change the `source` variable to a direct link to your latest tar archive. This can be a linked file in your GitHub releases or anywhere else that you store your releases. You can create this tar archive by copying the files you wish to archive to a temporary directory and then using the `tar` command. An example would be as follows (from the project root):

    ```bash
    mkdir temp
    cd temp
    cp ../target/release/<binary name> .
    cp ../README.md .
    tar -czf <binary name>-<version number>-<system architecture>.tar.gz <binary name> README.md
    ```

1. Remove the `noextract`, `md5sums`, and `validpgpkeys` variables.
1. Add the `sha256sums` variable and calculate the `sha256` hash of your tar archive by running the `sha256sum` command on it, then place the hash into the list. For example,

    ```bash
    sha256sums=("4c51cd1fcd5160a967c46007742a71aae9cc85dcdcf0c06e82711755f65d413e")
    ```

1. Remove all functions except for the `package` function.
1. Replace the contents of the `package` function with

    ```bash
    package() {
        cd "$srcdir/"

        install -Dm755 <binary name> -t "${pkgdir}/usr/bin/"
        install -Dm644 README.md -t "${pkgdir}/usr/share/doc/${pkgname%-bin}/"
    }
    ```

    This will install the pre-built binary to the system's binary directory and install the `README.md` file to the appropriate location.

And voila, you have finished writing the `PKGBUILD` file for your `-bin` package. The following steps are testing it to ensure that you're not bricking people's machines with some bad commands.

For reference, my `PKGBUILD` for [`didyoumean-bin`](https://aur.archlinux.org/packages/didyoumean-bin) is as follows:

```bash
# Maintainer: Hisbaan Noorani <hisbaan@gmail.com>
pkgname=didyoumean-bin
pkgver=1.1.2
pkgrel=1
epoch=
pkgdesc="A CLI spelling corrector"
arch=('x86_64')
url="https://github.com/hisbaan/didyoumean"
license=('GPL3')
depends=('gcc-libs')
optdepends=('libxcb: X11 clipboard support'
            'wayland: Wayland clipboard support')
provides=('didyoumean')
conflicts=('didyoumean')
source=("https://github.com/hisbaan/didyoumean/releases/download/v${pkgver}/dym-${pkgver}-x86_64.tar.gz")
sha256sums=("4c51cd1fcd5160a967c46007742a71aae9cc85dcdcf0c06e82711755f65d413e")

package() {
    cd "$srcdir/"

    install -Dm755 dym -t "${pkgdir}/usr/bin/"
    install -Dm644 README.md -t "${pkgdir}/usr/share/doc/${pkgname%-bin}/"
}
```

## Stable Packages

Stable packages are intended to build the application from the source of your latest stable release. These have the downsides of both git and binary packages in that, like git packages, they require the user to build the package, and like binary packages, they must be refreshed on every release leading to more maintenance. The benefit of these packages is that the user can get a stable experience while still being able to compile the package themselves for an architecture that you do not package a binary version of. The added benefit is that they can read over the source code for your application before installing it.

Clone the repository at `ssh://aur@aur.archlinux.org/<package name>`. You can then create a `PKGBUILD` file. If you are on an Arch-based distribution, you can run `cp /usr/share/pacman/PKGBUILD.proto PKGBUILD` to get a simple template. Then, perform the following steps.

1. Remove the comments at the top of the file, except for the `# Maintainer...` comment. Change this comment to your information.
1. Change the `pkgname` variable to your application name followed by the `-git` suffix.
1. Change the `pkgver` variable to your package version.
1. Change the `pkgrel` variable to indicate minor releases or bug fixes.
1. You can remove the `epoch` variable. This variable indicates changes even more minuscule than `pkgrel` denotes.
1. Change the `pkgdesc` variable to describe what your application does. This should ideally be just one sentence.
1. Add compatible architectures to a space-separated list of strings. This list should only contain valid architecture strings. An example of this variable could be:

    ```
    arch=('i686' 'pentium4' 'x86_64' 'arm' 'armv7h' 'armv6h' 'aarch64')
    ```

1. Change the `url` variable to the `https` variable of your `git` remote. An example of this would be `https://github.com/hisbaan/didyoumean`.
1. Add your license(s) to the `license` variable. For the GPLv3.0 license, use `GPL3`.
1. Remove the `groups` variable.
1. Add your application's runtime dependencies to the `dependencies` variable. Most Rust applications built against GNU utils will depend on `gcc-libs`.
1. Add your application's build dependencies to the `makedepends` variable. This will definitely include `git` and `cargo` but may include more.
1. If needed, add the `optdepends` variable. This is used to define optional dependencies for certain features. It is structured as follows:

    ```
    optdepends=('libxcb: X11 clipboard support'
                'wl-clipboard: Wayland clipboard support')
    ```

1. Remove the `provides` and `conficts` variables. Since this package does not have the `-git` or `-bin` suffix, and the package name is automatically added to these two variables, we do not have to put anything in them.
1. If you are publishing a fork of another application, add that application's package to the `replaces` variable, so your package takes precedent over the package you are replacing.
1. `backup` is for preserving user-made changes to a package. It's primarily intended for any configuration files in `/etc`. For example, `/etc/pacman.conf`. You can find more information about it [here](https://wiki.archlinux.org/title/PKGBUILD#backup).
1. Unless you need them, remove the `options`, `install`, and `changelog` variables.
1. Change the `source` variable to the source code of the release you are targetting. If you are using GitHub releases, this could be:

    ```
    source=("$pkgname-$pkgver.tar.gz::$url/archive/v$pkgver.tar.gz")
    ```

1. Remove the `noextract` and `md5sums` variables.
1. Add the `sha256sums` variable and calculate the `sha256` hash of your tar archive by running the `sha256sum` command on it, then place the hash into the list. For example,

    ```bash
    sha256sums=("4c51cd1fcd5160a967c46007742a71aae9cc85dcdcf0c06e82711755f65d413e")
    ```

1. Replace the contents of the `prepare` function with

    ```bash
    prepare() {
        export RUSTUP_TOOLCHAIN=stable
        export CARGO_TARGET_DIR=target

        cd "$srcdir/${pkgname%-git}"
        cargo fetch --locked --target "$CARCH-unknown-linux-gnu"
    }
    ```

    This will fetch the dependencies required for the rest of the installation to be offline. This is good practice but is not strictly needed. If you do not want to do this, you will have to modify the `cargo build` command in the `build` function in the next step.
1. Replace the contents of the `build` function with

    ```bash
    build() {
        export RUSTUP_TOOLCHAIN=stable
        export CARGO_TARGET_DIR=target

        cd "$srcdir/${pkgname%-git}"
        cargo build --release --frozen
        strip target/release/${pkgname} # or the path to the binary
                                        # if it differs from your package name.
    }
    ```

    This will build the release build of your application and then reduce the binary size by removing unnecessary build information from the produced binary.
1. If you would like to, replace the contents of the `check` function to run your tests.

    ```bash
    check() {
        cd "$srcdir/${pkgname%-git}"
        export RUSTUP_TOOLCHAIN=stable
        export CARGO_TARGET_DIR=target
        cargo test --release --frozen
    }
    ```

    I do not do this in my packages as I have Github's CI/CD pipeline do the testing for me. The benefit of not including this is significantly reduced build times. Since Rust has a relatively slow build process, I don't include this in my packages.
1. Replace the contents of the `package` function with

    ```bash
    package() {
        cd "$srcdir/${pkgname%-git}"

        # replace ${pkgname} with the name of your binary if it differs from the package name.
        install -Dm755 target/release/${pkgname} -t "${pkgdir}/usr/bin/"

        # you do not need to install the license if it is present under `/usr/share/licenses/common/`.
        install -Dm644 LICENSE -t "${pkgdir}/usr/share/licenses/${pkgname%-git}/"
        install -Dm644 README.md -t "${pkgdir}/usr/share/doc/${pkgname%-git}/"
    }
    ```

    This will install the built binary to the system's binary directory and install the `LICENSE` and `README.md` files to their respective locations with the correct permissions.

And voila, you have finished writing the `PKGBUILD` file for your stable package. The following steps are testing it to ensure that you're not bricking people's machines with some bad commands.

For reference, [orhun](https://github.com/orhun)'s `PKGBUILD` for [`didyoumean`](https://aur.archlinux.org/packages/didyoumean) is as follows:

```bash
# Maintainer: orhun <orhunparmaksiz@gmail.com>
# https://github.com/orhun/pkgbuilds

pkgname=didyoumean
pkgver=1.1.2
pkgrel=1
pkgdesc="A CLI spelling corrector"
arch=('x86_64')
url="https://github.com/hisbaan/didyoumean"
license=('GPL3')
depends=('gcc-libs' 'libxcb' 'openssl')
makedepends=('cargo')
source=("$pkgname-$pkgver.tar.gz::$url/archive/v$pkgver.tar.gz")
sha512sums=('1e6cce23bdbb70b4039e252058141a4dc7705f312cd1ed7dc7a8fd389e7f3a975527b2033ac2e3e89b2b1daeea46970b630c763d904e5aa299e643b229bbfbb9')

prepare() {
  cd "$pkgname-$pkgver"
  cargo fetch --locked --target "$CARCH-unknown-linux-gnu"
}

build() {
  cd "$pkgname-$pkgver"
  export RUSTUP_TOOLCHAIN=stable
  export CARGO_TARGET_DIR=target
  cargo build --release --frozen
}

check() {
  cd "$pkgname-$pkgver"
  cargo test --frozen --lib
}

package() {
  cd "$pkgname-$pkgver"
  install -Dm 755 "target/release/dym" -t "$pkgdir/usr/bin"
  install -Dm 644 docs/README.md -t "$pkgdir/usr/share/doc/$pkgname"
}
```

## Testing and Publishing

Now for the common parts of all three types of AUR packages. We will test that the package is building correctly. Go ahead and run `makepkg` in the same directory as your `PKGBUILD`. This will build your package and produce a `.tar` file of the output directories. To ensure that your package build is installing files to the correct location, run `tar -tf <package name>-<version number>-<system architecture>.pkg.tar`, which should produce something similar to:

```
.BUILDINFO
.MTREE
.PKGINFO
usr/
usr/bin/
usr/bin/dym
usr/share/
usr/share/doc/
usr/share/doc/didyoumean/
usr/share/doc/didyoumean/README.md
usr/share/licenses/
usr/share/licenses/didyoumean/
usr/share/licenses/didyoumean/LICENSE
```

This command will show all the directories and files in the tar archive. Ensure that your binary is in `/usr/bin/<binary name>`, and your license and readme are in the respective place if need be.

Additionally, you can build the package on a `chroot` or fresh install to ensure that you have not missed any dependencies that you already had installed. I won't cover that in this article, but there are many guides online.

To get the information that the AUR uses to describe the package, the AUR uses a pre-generated `.SRCINFO` file. This is because it may be potentially unsafe to read from or run an untrusted `PKGBUILD` file on the AUR's servers. To generate this file, run `makepkg --printsrcinfo > .SRCINFO`.

And you're just about done. Delete any build artifacts from our previous `makepkg` runs and push the `PKGBUILD` and `.SRCINFO` files to the AUR's git server.

Congrats! You've published your first AUR package. Users will be able to install it through their AUR helper of choice. With `paru`, the command would be:

```bash
paru -S <package name>
```

# Homebrew

Homebrew is a package manager primarily targetting macOS. It works on other operating systems too, but it's safe to assume that the majority (if not all) of your users wanting your package on Homebrew will be running on macOS. This is an excellent point to do a sanity check and test whether your app actually works on macOS. Now that we've gone through that let's get on to actually packaging it. In this article, I'll only be covering binary packaging in Homebrew.

First, you will need to build a binary. If you're on macOS, then simply run `cargo build --release` as you usually would; however, there are some steps required to build a macOS binary if you're on another platform. Personally, I would recommend finding an Apple machine and simply building on that. However, if that is not an option, check out this [excellent article by James Waples](https://wapl.es/rust/2019/02/17/rust-cross-compile-linux-to-macos.html) about cross-compiling to macOS. Additionally, it's good to run `strip` on the binary to remove any unnecessary build information.

Now that you have a built binary go ahead and compress it as a `tar.gz` archive by running the command `tar -czf <binary name>-<version number>-<system architecture>.tar.gz <binary name>`. Then make this archive accessible through some means. I personally put the binary release in my GitHub releases.

Next, create a GitHub repository with the prefix `homebrew-`. For example, my Homebrew Formula repository is titled [`homebrew-tap`](https://github.com/hisbaan/homebrew-tap). This allows users to add your repository using the `brew tap` command. So to add my `homebrew-tap` repository, the user would run.


```bash
brew tap hisbaan/tap
```

Notice that the initial `homebrew-` is omitted from the command. This is intentional and is how the `brew` CLI is designed.

Now we'll get onto the repository structure. It should look something like this. The main files you should pay attention to are the `Formula` directory and the `didyuomean.rb` file. The `LICENSE` and `README.md` files are optional (but recommended).

```
homebrew-tap
├── Formula
│   └── didyoumean.rb
├── LICENSE
└── README.md
```

You can have more than one Formula in a single Homebrew tap, hence the Formula directory. Now we will explore the contents of the `didyoumean.rb` file. This Ruby file contains the necessary information to install the pre-built binary that we tar'd earlier.

```ruby
class Didyoumean < Formula
    desc "A CLI spelling corrector"
    homepage "https://github.com/hisbaan/didyoumean"
    url "https://github.com/hisbaan/didyoumean/releases/download/v1.1.2/dym-1.1.2-x86_64-apple-darwin.tar.gz"
    sha256 "06167f4bd847f86b22440e0e51e7ab2b0ff38efe1e914c0e2650fff0433f229f"
    version "1.1.2"

    def install
        bin.install "dym"
    end
end
```

- The `desc` variable is a description of your package
- The `homepage` variable links to the project's home page. This could be a website or just a `git` repo.
- The `url` is a direct download link to your tarball.
- The `sha256` variable is a `sha256` hash of the tarball obtained by running `sha256sum` on the tarball.
- The `version` variable is the version number of your package.
- The `install` function is the process that will install your binary. We will use the built-in `bin.install` command. The only argument to the command should be the name of the binary in the tarball.

Go ahead and push your changes, and your program will b installable as follows:

```bash
brew tap <username>/tap # or a different repository if you have a different name.
brew install <package name>
```

And just like that, you've packaged your application for Homebrew!

## Conclusion

This brings our journey through packaging to an end... for now! There are lots of things that you can take away from this article. You can apply the things you've learned here to more packaging standards (as I'm sure you've noticed, they're all relatively similar with a few minor tweaks here and there) and applications built in more programming languages. Good luck with your journey ahead, and if you end up releasing anything, shoot a message my way, I'd love to see it!
