import React, { useState, useRef } from 'react'
import { Field, ErrorMessage as BaseErrorMesssage, FieldArray, getIn } from 'formik'
import componentInLibraries from './componentInLibraries'

export default (props) => {
  const {
    item: { type, id, label, forceLabel = false, className = "", },
    hideErrors,
  } = props

  return <div className={`form-control mb-4 ${className}`}>
    {
      (label && forceLabel) &&
      <label className="label">
        <span>{label}</span>
      </label>
    }
    <FieldArray
      type={type}
      name={id}
      //validateOnChange
      component={(arrayHelpers) => render({ ...props, arrayHelpers })} />
    {/* <FieldArray
      type={type}
      name={id}
      render={(arrayHelpers) => render({ ...props, arrayHelpers })} /> */}
    {/* <FieldArray
      type={type}
      name={id}>
      {(arrayHelpers) => render({ ...props, arrayHelpers })}
    </FieldArray> */}
    {!hideErrors ?
      <ErrorMessage
        name={id}
        component="div"
        className="text-sm text-red-600 pt-2" /> : null}
  </div>
}


const ErrorMessage = ({ name }) => (
  <Field
    name={name}
    render={({ form }) => {
      const error = getIn(form.errors, name)
      const touch = getIn(form.touched, name)
      return touch && error ? error : null
    }}
  />
)

const render = (props) => {
  const {
    values,
    initialValues,
    item: {
      id,
      className = "",
      params,
      container,
      add,
      preferInitialValues
    },

    hideErrors } = props

  // let items = values[id] ? values[id] : null
  // if ((!items || !items.length || !items.filter(a => a).length) && (initialValues[id] && initialValues[id].length)) {
  //   items = initialValues[id]
  // }

  let items = preferInitialValues ? initialValues[id] : (values[id] ? values[id] : null)

  //const [counter, setCounter] = useState(1)
  const _cachedValues = useRef(props.values)
  const Component = componentInLibraries({ componentsLibraries: props.componentsLibraries, item: params })
  if (!Component) {
    return null
  }

  const { arrayHelpers } = props
  const { move, swap, push, insert, unshift, pop, remove, form } = arrayHelpers

  const onAdd = () => {
    onLayoutWillChange()
    //console.log('%conAdd pressed', 'color: red;', params.params)
    push(params.params.placeholder ? params.params.placeholder() : null)
  }

  const onLayoutWillChange = () => {
    //const { item: { id }, setFieldValue, setFieldTouched, setValues } = props
    //setValues(_cachedValues.current)
  }

  const onValueChanged = (value) => {
    const { item: { id }, setFieldValue, setFieldTouched, setValues } = props

    const _values = { ...props.values }
    _values[id] = value
    _cachedValues.current = { ..._values }
    props._onValueChanged && props._onValueChanged({ id, value })
    //setValues(_values)
    //TODO:
    // setFieldValue(id, value, true)
    // setFieldTouched(id, true, false)
  }

  var ContainerComponent = componentInLibraries({
    componentsLibraries: props.componentsLibraries,
    item: container
  })

  if (!ContainerComponent) {
    ContainerComponent = ({ children }) => <div>{children}</div>
  }

  var AddComponent = componentInLibraries({
    componentsLibraries: props.componentsLibraries,
    item: add
  })

  if (!AddComponent) {
    AddComponent = ({ onClick, title, disabled }) => <div className={`flex justify-center my-10`}><button disabled={disabled}
      type="button"
      onClick={onClick}>
      {title ? title : "Add"}
    </button>
    </div>
  }

  return <div>
    <div className={`w-full overflow-x-scroll ${props.item.isHorizontal ? 'flex gap-2 pb-8' : ''}`}>
      {(items && items.length > 0) && items.map((entry, index) => {
        const itemId = `${id}.${index}`
        return <div key={index} className={`form-control ${!props.item.isHorizontal ? 'mb-4' : ''}  ${className}`}>
          {/* {
        (label && forceLabel) &&
        <label className="label">
          <span>{label}</span>
        </label>
      } */}

          <Field type={params.type} name={itemId} >
            {({ field, form }) => {
              const onRemoveRequired = () => {
                remove(index)
                const _i = [...items]
                _i.splice(index, 1)
                onValueChanged(_i)
                //setCounter(counter + 1)
              }

              const onMoveDownRequired = () => {
                if (items.length <= index) {
                  return
                }
                swap(index, index + 1)

                const _i = [...items]
                const object = _i[index]
                const other = _i[index + 1]
                _i[index] = other
                _i[index + 1] = object
                onValueChanged(_i)
                //setCounter(counter + 1)
              }

              const onMoveUpRequired = () => {
                if (index === 0) {
                  return
                }
                swap(index, index - 1)

                const _i = [...items]
                const object = _i[index]
                const other = _i[index - 1]
                _i[index] = other
                _i[index - 1] = object
                onValueChanged(_i)
                //setCounter(counter + 1)
              }

              const onEntryValuesChanged = (value) => {
                const _i = [...items]
                _i[index] = value
                onValueChanged(_i)
              }

              const disabled = props.isSubmitting || props.disabled || (props.item && props.item.disabled)
              const readOnly = props.readOnly || (props.props && props.props.readOnly)

              return <ContainerComponent
                {...container}
                // {...props}
                arrayHelpers={arrayHelpers}
                onMoveDownRequired={onMoveDownRequired}
                onMoveUpRequired={onMoveUpRequired}
                onRemoveRequired={onRemoveRequired}
                canMoveUp={props.item.canMove && (index > 0)}
                canMoveDown={props.item.canMove && (index < (items.length - 1))}
                canRemove={props.item.canRemove}
                showControls={props.item.showControls}
                index={index}
                value={entry}>
                <Component
                  {...props}
                  disabled={disabled}
                  readOnly={readOnly}
                  value={entry}
                  {...params.params}
                  onValueChanged={onEntryValuesChanged} />
              </ContainerComponent>
            }}
          </Field>
          {!hideErrors ?
            <BaseErrorMesssage
              name={itemId}
              component="div"
              className="text-sm text-red-600 pt-2" />
            : null}
        </div>
      })}
    </div>
    {(!props.disabled && props.item.canAddItems && items.length < props.item.maxItems) &&
      <AddComponent onClick={onAdd} title={add.title} disabled={items.length >= props.item.maxItems} />
    }
  </div>
}
