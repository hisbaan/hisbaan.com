---
layout: post
title: "Integrating Jekyll Into Your Website"
author: "Hisbaan Noorani"
tags: jekyll web
---

I won't lie to you; working with Jekyll isn't as easy as everyone says it is---at least not when you're working with a pre-existing codebase. That being said, it certainly isn't the hardest thing in the world, and I'm going to talk about how I integrated Jekyll into my pure HTML + CSS (+ some JavaScript) website to bring you this very blog.

I'm assuming that you already have a static site in place. The source code for my website can be found [here](https://github.com/hisbaan/hisbaan.com). I have not tested this with any frameworks, so I'm not sure of how well it would work with those. First, we will create some files.

1. Create a `_config.yml` file in your project's root directory. This file will describe how Jekyll should build your project. Mine is as follows:

    ```yml
    collections:
      posts:
        output: true
        permalink: /articles/:name

    defaults:
      # Set default layout and gemini false
      -
        scope:
          path: ""
        values:
          layout: "default"
      # Use post layouts
      -
        scope:
          path: ""
          type: "posts"
        values:
          layout: "post"
    ```

2. Create a `_layouts` directory which we will populate with layout files. These layout files are essentially templates that you can use with `html` and `md` files.

3. Create some layouts in the `_layouts` directory. These can reference each other to avoid boilerplate code. You will want to create a base layout called `default.html` which should look something like this:

    {% raw %}
    ```html
    <!DOCTYPE html>
    <html>
        <head>
            <!-- head contents -->
        </head>

        <body>
        <header>
            <!-- header contents -->
        </header>

        {{ content }}

        <footer>
            <!-- footer contents -->
        </footer>
        </body>
    </html>
    ```
    {% endraw %}

    There are two main things to note about this. The first is that `{{ content }}` will be replaced with the contents of whatever is using this layout file. This syntax is called Liquid, and it is the primary syntax used by Jekyll. It can be used to write if statements, for loops, and much more. The second thing to note is that you can reference your CSS and JS files by prefixing the normal path with `/`, signifying the root of the project structure. So if I have my `style.css` file in `css/style.css`, then I would reference it with the path `/css/style.css`.

    I also created a `post.html` file which is as follows:

    {% raw %}
    ```html
    ---
    layout: default
    ---

    {% if page.title %}
    	<h1>{{page.title}}</h1>
    {% else %}
    	<h1>Untitled post</h1>
    {% endif %}

    <p>{{ page.date | date: "%b %d, %Y" }} {% if page.author %} - {{ page.author }} {% endif %}</p>

    {{ content }}
    ```
    {% endraw %}

    The section at the top is how different layouts are referenced. This is a 'nested' layout, so to speak, as it is a layout used by other files that calls another layout, the default layout that we just set up.

4. Create the `_posts` directory and make some posts in the `_posts` directory. These are just markdown files with a specific format. For example, take this file: the title of this file is `2021-12-19-integrating-jekyll-into-your-website.md`, and the header is as follows,

    ```md
    ---
    layout: post
    title: "Integrating Jekyll Into Your Website"
    author: "Hisbaan Noorani"
    tags: jekyll web
    ---
    ```

    The rest of the file is just normal markdown.

5. Create a way to view your posts. The best way I figured out how to do this is to use an HTML file with Liquid syntax. I created an `articles` directory in the project's root directory as that is what I want the gallery page to be called. Within that `articles` directory, I created an `index.html` file which is as follows:

    {% raw %}
    ```html
    ---
    layout: default
    ---
    <h1>Articles</h1>
    <p>
        Description here
    </p>
    <br />
    <ul class="posts">
        {% for post in site.posts %}
        <li class="post" >
            <div class="post-title">
                <a href="{{ post.url | relative_url }}"> {{ post.title }} </a>
            </div>

            {{ post.excerpt | truncate: 153 }}
            <!-- TODO style this list like tai's blog -->
            <ul class="post-info">
                {% if post.author %}
                <li>
                    <i class="fa fa-user"></i> {{ post.author }}
                </li>
                {% endif %}
                <li>
                    <i class="fa fa-clock-o"></i> {{ post.date | date: "%d/%m/%y" }}
                </li>
                {% if post.tags %}
                <li>
                    {% for tag in post.tags %}#{{ tag }} {% endfor %}
                </li>
                {% endif %}
            </ul>
        </li>
        {% endfor %}
    </ul>
    ```
    {% endraw %}

    This code loops through all the posts and displays an entry for each post which is styled using CSS. We then link to this file within our static site and we're almost done.

All that's left is to preview the site using the Jekyll CLI, which can be done by running `jekyll serve --port 4000` or any other open port then visiting `localhost:4000` to view the preview of your website. If you are deploying to GitHub Pages, then the Jekyll build should be automatic, but if you are not, check out Jekyll's own [guide on deployment](https://jekyllrb.com/docs/step-by-step/10-deployment/).

