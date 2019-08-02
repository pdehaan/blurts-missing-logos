# blurts-missing-logos

Checks for missing breach logos on the Firefox Monitor website.

## Usage

The module isn't published to npm, but you can use it directly from GitHub using `npx`:

```sh
npx pdehaan/blurts-missing-logos
```

If no missing breach logos are found, an empty array is returned.
If missing breach logos are found, an array of objects (with `logo`, `details`, and `status` properties) are returned:

```json
[
  {
    "logo": "https://monitor.firefox.com/img/logos/AnimePlanet.png",
    "details": "https://monitor.firefox.com/breach-details/AnimePlanet",
    "status": 404
  }
]
```

By default, the development server, https://fx-breach-alerts.herokuapp.com, is checked (in case breach logos have already been added but not yet deployed to production):

If you want to check against a different environment, you can pass a `SERVER` environment variable to the script. Or if you want to check production, you can simply pass the `-p` flag.

The following two commands are the same:

1. <kbd>SERVER=https://monitor.firefox.com npx pdehaan/blurts-missing-logos</kbd>
2. <kbd>npx pdehaan/blurts-missing-logos -p</kbd>

## LICENSE

[Mozilla Public License, version 2.0](./LICENSE)
