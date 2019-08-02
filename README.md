# blurts-missing-logos

Checks for missing breach logos for Firefox Monitor website.

## Usage

The module isn't published to npm, but you can use it directly from GitHub using `npx`:

```sh
npx pdehaan/blurts-missing-logos
```

If no missing breach logos are found, returns an empty array.
If breaches are found, an array of objects (with `url` and `err` properties) are returned:

```json
[
  {
    "url": "https://monitor.firefox.com/img/logos/AnimePlanet.png",
    "err": 404
  },
  {
    "url": "https://monitor.firefox.com/img/logos/Artvalue.png",
    "err": 404
  },
  {
    "url": "https://monitor.firefox.com/img/logos/ClashOfKings.png",
    "err": 404
  },
  {
    "url": "https://monitor.firefox.com/img/logos/EpicNPC.png",
    "err": 404
  },
  {
    "url": "https://monitor.firefox.com/img/logos/Snail.png",
    "err": 404
  }
]
```

By default, the development server, https://fx-breach-alerts.herokuapp.com, is checked (in case breach logos have already been added but not yet deployed to production):

If you want to check against a different environment, you can pass a `SERVER` environment variable to the script:

```sh
SERVER=https://monitor.firefox.com npx pdehaan/blurts-missing-logos

[
  {
    "url": "https://monitor.firefox.com/img/logos/Snail.png",
    "err": 404
  }
]
```

## LICENSE

[Mozilla Public License, version 2.0](./LICENSE)
