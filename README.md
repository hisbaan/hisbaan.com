This is the source code for [hisbaan.com](https://hisbaan.com)

# Development

Clone the repository:

```bash
git clone git@github.com:hisbaan/hisbaan.com
cd hisbaan.com
```

Install `bundle` via `gem` or your system's package manager and run the
following command:

```bash
bundle install
```

This will install all the dependencies for the project. Then, run the
following command to deploy a local version of the website to
<http://localhost:4000>. Use the `--port <port numbe>` flag to change
the port if `4000` is occupied.

```bash
bundle exec jekyll serve
```
