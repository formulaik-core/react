import React, { useState } from 'react'
import { Field, FastField, ErrorMessage as BaseErrorMesssage, } from 'formik'
import componentResolver from '../../componentResolver'
import Add from './chunks/add'

export default (props) => {
  const {
    initialValues,
    item: {
      id,
      className = "",
      params,
      container,
      add,
      preferInitialValues,
      isDependant = false,
    },
    containersProps,
    hideErrors } = props

  let _items = preferInitialValues ? initialValues[id] : (props.valuesRef.current[id] ? props.valuesRef.current[id] : null)
  if (!_items) {
    _items = []
  }

  const [items, setItems] = useState(_items)

  const Component = componentResolver({ ...props, componentsLibraries: props.componentsLibraries, item: params })
  if (!Component) {
    return null
  }

  let ContainerComponent = componentResolver({
    ...props,
    componentsLibraries: props.componentsLibraries,
    item: container
  })

  if (!ContainerComponent) {
    ContainerComponent = ({ children }) => <div>{children}</div>
  }

  let AddComponent = componentResolver({
    ...props,
    componentsLibraries: props.componentsLibraries,
    item: add
  })

  if (!AddComponent) {
    AddComponent = Add
  }

  const { arrayHelpers } = props
  const { move, swap, push, insert, unshift, pop, remove, form } = arrayHelpers

  const onAdd = async () => {
    const newItem = params.params.placeholder ? await params.params.placeholder() : null
    const _i = [...items, newItem]
    onValueChanged(_i)
    push(newItem)
  }

  const onValueChanged = (value) => {
    const { item: { id },
      setFieldValue,
      setFieldTouched,
      setValues } = props

    const _values = { ...props.valuesRef.current }
    _values[id] = value

    props._onValueChanged && props._onValueChanged({ id, value })
    setItems(value)
    //setValues(_values, false)

    //TODO:
    //setFieldValue(id, value, true)
    // setFieldTouched(id, true, false)
  }

  const Renderer = isDependant ? Field : FastField

  return <div>
    <div className={`w-full overflow-x-scroll ${props.item.isHorizontal ? 'flex gap-2 pb-8' : ''}`}>
      {(items && items.length > 0) && items.map((entry, index) => {
        const itemId = `${id}.${index}`
        return <div
          key={index}
          className={`form-control ${!props.item.isHorizontal ? 'mb-4' : ''}  ${className}`}>

          <Renderer type={params.type} name={itemId} >
            {({ field, form }) => {

              const onRemoveRequired = () => {
                remove(index)
                const _i = [...props.valuesRef.current[id]]
                _i.splice(index, 1)
                onValueChanged(_i)
              }

              const onMoveDownRequired = () => {
                if (items.length <= index) {
                  return
                }
                swap(index, index + 1)

                const _i = [...props.valuesRef.current[id]]
                const object = _i[index]
                const other = _i[index + 1]
                _i[index] = other
                _i[index + 1] = object
                onValueChanged(_i)
              }

              const onMoveUpRequired = () => {
                if (index === 0) {
                  return
                }
                swap(index, index - 1)

                const _i = [...props.valuesRef.current[id]]
                const object = _i[index]
                const other = _i[index - 1]
                _i[index] = other
                _i[index - 1] = object
                onValueChanged(_i)
              }

              const onEntryValuesChanged = (value) => {
                const _i = [...props.valuesRef.current[id]]
                _i[index] = value
                onValueChanged(_i)
              }

              const disabled = props.isSubmitting || props.disabled || (props.item && props.item.disabled)
              const readOnly = props.readOnly || (props.props && props.props.readOnly)

              const adaptedProps = { ...props }
              adaptedProps.item = {
                ...adaptedProps.item,
                params: adaptedProps.item.params
              }

              const onContainerPropsChanged = (containerProps) => {
                props.onContainerPropsChanged({ id: itemId, props: containerProps })
              }

              return <ContainerComponent
                {...container}
                // {...props}
                {...props.item}
                arrayHelpers={arrayHelpers}
                onMoveDownRequired={onMoveDownRequired}
                onMoveUpRequired={onMoveUpRequired}
                onRemoveRequired={onRemoveRequired}
                canMoveUp={props.item.canMove && (index > 0)}
                canMoveDown={props.item.canMove && (index < (items.length - 1))}
                canRemove={props.item.canRemove}
                showControls={props.item.showControls}
                index={index}
                value={entry}
                containerProps={containersProps[itemId]}
                onContainerPropsChanged={onContainerPropsChanged}>
                <Component
                  {...adaptedProps}
                  disabled={disabled}
                  readOnly={readOnly}
                  value={entry}
                  // {...params}
                  onValueChanged={onEntryValuesChanged} />
              </ContainerComponent>
            }}
          </Renderer>
          {!hideErrors ?
            <BaseErrorMesssage
              name={itemId}
              component="div"
              className="text-sm text-red-600 pt-2" />
            : null}
        </div>
      })}
    </div>
    {(!props.disabled && props.item.canAddItems && !items.length < props.item.maxItems) &&
      <AddComponent
        onClick={onAdd}
        title={add.title}
        disabled={items.length >= props.item.maxItems} />
    }
  </div>
}
