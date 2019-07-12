# i18n Tag Next Plugin

> A Nextjs plugin for internationalization using [es2015-i18n-tag](https://www.npmjs.com/package/es2015-i18n-tag).
> Works with SSR and plain HTML exports.

## Usage

In `next.config.js`:

```js
const { withI18nTagPlugin } = require('i18n-tag-next-plugin/lib/plugin')

module.exports = withI18nTagPlugin(
  {
    // Config goes here
  })
)

```

### Defining locales

Your must make a `locales` module available to pages.
It exports a `Locales` object as follow :

```ts
interface Locales {
  locales: {
    fr: LocaleObject,
    en: LocaleObject,
    de: LocaleObject,
    // ...
  }
  default: LocaleObject,
}
```

The `locales` property is an object whose properties will be used to determine
the `lang` prefix to add to your app's pathnames.

The `LocaleObject` is as follow:

```ts
interface LocaleObject {
  locales: string, // "en-GB", "fr-CH", "de-DE", ...
  translations: Object<string, string>, // Key-Value translations
  number: Intl.NumberFormat, // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
  date: Intl.DateTimeFormat, // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
  plurals: (integer) => "none"|"one"|"few"|"many"|"other"
}
```

### Pages

Pages must live in a `[lang]` subdirectory.
Your `/pages/index.js` should redirect to a default language,
e.g: make `/` redirect to `/de/`.

Pages must use the `withTranslation(locales)(PageComponent)` HOC.

All paths will be prefixed with the current language.
All pages receive a `lang` prop matching the language prefix.

Use the dedicated `Link` component to automatically add the proper lang
prefix to pages.
This `Link` component has an additional `lang` prop to override the lang prefix.

In each page:

```js
import T, { withTranslation, Link } from 'i18n-tag-next-plugin'
import locales from '../../locales'
import useStore from '../../store'

function Home() {
  const user = useStore()

  return (
    <div className="App">
      <h1>{T`Hello ${user.name}`}</h1>
      <ul>
        <li>
          <Link href="/about">{T`Go to about page without changing language`}</Link>
        </li>
        <li>
          <Link href="/about" lang="fr">{T`Go to the french about page`}</Link>
        </li>
      </ul>
    </div>
  )
}

export default withTranslation(locales)(Home))
```

### Plurals

#### In your `locales` module:

1. Define a `plurals()` function for each locale (there is no default).
   This function returns which kind of plural to use for a given number. (There can be 5 in polish)
2. Add a translation for each kind of plural in the `translations` map:
   append the plural kind to the key, separated with `:`.

   ```js
   {
     "${0} horse:none": "pas de cheval", // used if ${0} == 0
     "${0} horse:one": "un cheval",
     "${0} horse:many": "${0} chevaux"
   }
   ```

#### In you components:

Use the key without the plural suffix:

```js
T.some(0, "${0} horse") // pas de cheval
T.some(1, "${0} horse") // un cheval
T.some(1000, "${0} horse") // 1000 chevaux
```