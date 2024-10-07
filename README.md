# Formulaik React JS Engine

[![NPM](https://img.shields.io/npm/v/@formulaik/react.svg)](https://www.npmjs.com/package/formulaik/react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Visit [The Formulaik project](https://formulaik-core.github.io/documentation/) to get started with Formulaik.

Formulaik official react engine.

![](https://formulaik-core.github.io/documentation/img/icon_xs.svg)

> [The Formulaik project](https://formulaik-core.github.io/documentation/) is an open source initiative for defining cross-platform forms, enabling reusable components in a JSON based declarative approach. Formulaik aims to simplify form building across various front-end frameworks. Formulaik defines a protocol for defining form inputs as a sole source of truth (data type, behaviour, validation) in json, which is interpreted by a platform-specific formulaik engine.

## Install

1. Install the React formulaik engine

```bash
npm install @formulaik/react
```

2. Install a React Formulaik component library
The [Mui component library](https://github.com/formulaik-community/formulaik-mui-react) for example

```bash
npm install @formulaik-community/formulaik-mui-react
```

## Usage

Create your inputs and create the form using formulaik:

```jsx
import Formulaik from '@formulaik/react'
import FormulaikPaper from '@formulaik-community/react-native-paper'
import { Text } from 'react-native'

const inputs = [
  {
    type: 'input',
    schema: 'email',
    id: 'email',
    label: 'Email',
    params: {
      type: 'email',
      placeholder: "email@domain.com"
    }
  },
  {
    type: 'inputPassword',
    schema: 'password',
    label: 'Password',
    id: 'password',
    params: {
      type: 'password',
      autoComplete: "current-password",
      placeholder: "xxxx-xxxx-xxxx"
    }
  },
  {
    type: 'submit',
    params: {
      text: 'Continue'
    }
  },
]

export default (props) => {
 const onSubmit = async (values) => {
    const { email, password } = values
    try {
      await myapi.submit({ email, password })
    }
    catch(e) {
      throw (new Error('Could not sign in: ', e.message))
    }
    return { message: t("Email validated") }
  }

  const values = {
      email: cookies.get('email'),
  }

  return <>
      <Text>Login</Text>
      <Formulaik
        components={[FormulaikPaper]}
        values={values}
        inputs={inputs}
        onSubmit={onSubmit}
         />
    </>
}
```

## Versionning
This repository follows the semantic branching model.

## Contributors
[<img src="https://github.com/adoucoure.png" width="60px;"/>
<br />
<sub>
<a href="https://github.com/adoucoure">Aboubacar Doucouré</a>
</sub>](https://adoucoure.com/formulaik)

This project follows the [all-contributors specification](https://github.com/all-contributors/all-contributors). Contributions of any kind welcome!
Please [contact me](https://adoucoure.com/contact) if you want to contribute to the core frameworks or add a components library.


## License

MIT © [yelounak](https://github.com/yelounak)

## References
- [The Formulaik project documentation](https://formulaik-core.github.io/documentation/)
- [Getting started with Formulaik React 🚀](https://formulaik-core.github.io/documentation/docs/next/gettingstarted/react/installation)
- [Contribute to Formulaik](https://formulaik-core.github.io/documentation/docs/next/contributing)
- [Forumaik Blog](https://adoucoure.com/formulaik)























