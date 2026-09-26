---
title: "Adding Applications to a Yocto Image"
description: "Extending an image with packages, writing a recipe for a custom application and enabling its systemd service at boot."
series: "yocto-project"
order: 12
tags: ["Yocto", "Systemd", "Recipes"]
---
## Adding packages to the image

Suppose the minimal Linux image does not contain a particular utility.

We can add packages through image configuration.

For example:

```text
IMAGE_INSTALL:append = " nano"
```

Multiple packages can be added:

```text
IMAGE_INSTALL:append = " \
    nano \
    openssh \
    curl \
"
```

This is much better than manually installing packages every time after boot.

The desired system configuration becomes part of the build.

## Adding a custom application

Suppose we have an embedded C++ application:

```text
my-app/
├── main.cpp
├── CMakeLists.txt
└── ...
```

We can create a Yocto recipe for it.

Conceptually:

```text
recipes-apps/
└── my-app/
    └── my-app.bb
```

The recipe tells Yocto how to:

1. Fetch the source
2. Configure the project
3. Compile it
4. Install the executable
5. Package it

The result becomes part of the final image.

## Systemd services

Embedded applications often need to start automatically.

For example:

```text
my-application.service
```

A service could conceptually contain:

```ini
[Unit]
Description=My Embedded Application
After=network.target

[Service]
ExecStart=/usr/bin/my-application
Restart=always

[Install]
WantedBy=multi-user.target
```

The recipe can install this service into the target filesystem and enable it.

Then the application can start automatically when Linux boots.
