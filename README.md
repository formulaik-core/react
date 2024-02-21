# Formulaik React JS Engine

[![NPM](https://img.shields.io/npm/v/formulaik.svg)](https://www.npmjs.com/package/formulaik) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Documentation
Formulaik's documentation is available [here](https://formulaik-core.github.io/documentation/)

## Install

```bash
npm install --save @formulaik/react
```

## Usage

1. Install formulaik, yup for validation and a component library

```bash
npm install yup @formulaik-community/react-mui
```

```jsx
import Formulaik from '@formulaik/react'
import FormulaikMui from '@formulaik-community/react-mui'
import * as Yup from 'yup'
```

2. Define inputs

```jsx
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
```

3. Provide initial values

```jsx
const initialValues = {
    email: cookies.get('email'),
}
```

4. Define validation

```jsx
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required("This field can't be blank"),
  password: Yup.string()
    .required("This field can't be blank")
    .min(7, 'Must contain at least 8 characters')
    .max(18, 'Must contain at most 18 characters')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
})
```

5. Render forms and handle submit

```jsx
export default (props) => {
  const onSubmit = async (values, { setSubmitting }) => {
    try {
      const { email, password } = values
      //... do login
      setError(null)
    } catch (e) {
      console.log(e)
      setError(e)
    }

    setSubmitting(false)
  }

  return <div>
      <h1>Login</h1>
      <Formulaik
        componentsLibraries={[FormulaikLocal,]}
        initialValues={initialValues}
        validationSchema={validationSchema}
        inputs={inputs}
        onSubmit={onSubmit}
        error={error} />
    </div>
}
```



## License

MIT © [yelounak](https://github.com/yelounak)
