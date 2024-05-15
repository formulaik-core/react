import { useState } from 'react'
import { Field, FastField, ErrorMessage as BaseErrorMesssage, } from 'formik'
import componentResolver from '../../componentResolver'
import AddButton from './chunks/add'
import * as ReactDOM from 'react-dom'
import PlatformContainer from '../../../platform/container/index.js'
import React from 'react'

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
      portalContainersRef
    },
    containersProps,
    hideErrors } = props

  let _items = preferInitialValues ? initialValues[id] : (props.valuesRef.current[id] ? props.valuesRef.current[id] : null)
  if (!_items) {
    _items = []
  }

  const [items, setItems] = useState(_items)

  let AddComponent = (add && add.component) ? add.component : componentResolver({
    ...props,
    components: props.components,
    item: add
  })

  if (!AddComponent) {
    AddComponent = AddButton
  }

  const { arrayHelpers } = props
  const { move, swap, push, insert, unshift, pop, remove, form } = arrayHelpers

  const onAdd = async (toAdd) => {
    // const newItem = toAdd
    //   ? toAdd
    //   : (params.params.placeholder ? await params.params.placeholder() : null)

    let newItem = null
    if (toAdd && (!toAdd.type || toAdd.type !== 'click')) {
      newItem = toAdd
    }
    else if (params.params.placeholder) {
      newItem = await params.params.placeholder()
    }

    const _i = [...items, newItem]
    onValueChanged(_i, {
      resetItems: false,
      operation: {
        type: 'add'
      },
      item: { ...newItem },
      index: (_i.length - 1)
    })
    push(newItem)
  }

  const onValueChanged = (value, params) => {
    const {
      resetItems = false
    } = params ? params : {}

    const { item: { id } } = props

    const _values = { ...props.valuesRef.current }
    _values[id] = value

    if (props._onValueChanged) {
      props._onValueChanged(
        { id, value },
        {
          ...params,
        }
      )
    }

    !resetItems && setItems(value)
  }

  const Renderer = isDependant ? Field : FastField

  return <React.Fragment>
    <PlatformContainer data-id='array-container'>
      <PlatformContainer
        data-id='array-container-content'
        style={{
          overflowX: "scroll",
          width: "100%",
          ...(props.item.isHorizontal && {
            "display": "flex",
            "paddingBottom": "2rem",
            "gap": "0.5rem"
          })
        }}
      >
        {(items && items.length > 0) && items.map((entry, index) => {
          const itemId = `${id}.${index}`

          let ContainerComponent = componentResolver({
            ...props,
            components: props.components,
            item: container,
            index,
            entry
          })

          if (!ContainerComponent) {
            ContainerComponent = ({ children }) => <PlatformContainer>{children}</PlatformContainer>
          }

          const Component = componentResolver({
            ...props,
            components: props.components,
            item: params,
            index,
            entry
          })

          if (!Component) {
            return null
          }

          return <PlatformContainer
            data-id='array-container-content-entry'
            key={index}
            className={`form-control ${className}`}>

            <Renderer
              data-id='array-renderer'
              className={'renderer'}
              type={params.type}
              name={itemId} >
              {({ field, form }) => {

                const onRemoveRequired = () => {
                  remove(index)
                  const _i = [...props.valuesRef.current[id]]
                  const object = _i[index]
                  _i.splice(index, 1)
                  onValueChanged(_i, {
                    resetItems: false,
                    operation: {
                      type: 'remove'
                    },
                    item: object,
                    index
                  })
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
                  onValueChanged(_i, {
                    resetItems: false,
                    operation: {
                      type: 'moveDown'
                    },
                    item: object,
                    index
                  })
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
                  onValueChanged(_i, {
                    resetItems: false,
                    operation: {
                      type: 'moveUp',
                    },
                    item: object,
                    index
                  })
                }

                const onEntryValuesChanged = (value, params) => {
                  const _i = [...props.valuesRef.current[id]]
                  _i[index] = value
                  onValueChanged(_i, params)
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

                const containerClassName = () => {
                  if (!container.className) {
                    return ''
                  }

                  if (typeof container.className !== 'function') {
                    return container.className
                  }

                  const className = container.className({ index, entry })
                  return className
                }

                if (portalContainersRef &&
                  portalContainersRef.current) {

                  if (!portalContainersRef.current.length
                    || index >= portalContainersRef.current.length) {
                    return null
                  }

                  const portalContainer = portalContainersRef.current[index]
                  if (!portalContainer) {
                    return null
                  }

                  return ReactDOM.createPortal(
                    <ContainerComponent
                      {...container}
                      // {...props}
                      {...props.item}
                      className={containerClassName()}
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
                    </ContainerComponent>,
                    portalContainer
                  )
                }
                else {
                  return <ContainerComponent
                    {...container}
                    // {...props}
                    {...props.item}
                    className={containerClassName()}
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
                }
              }}
            </Renderer>
            {!hideErrors ?
              <BaseErrorMesssage
                name={itemId}
                component="div"
                className="error-message" />
              : null}
          </PlatformContainer>
        })}
      </PlatformContainer>
      {(
        !props.disabled
        && props.item.canAddItems
        && items.length < props.item.maxItems)
        &&
        (() => {
          if (add.portalContainer) {
            if (!add.portalContainer.current) {
              return null
            }

            return ReactDOM.createPortal(
              <AddComponent
                onAdd={onAdd}
                title={add.title}
                disabled={items.length >= props.item.maxItems} />,
              add.portalContainer.current
            )
          }

          return <AddComponent
            onAdd={onAdd}
            title={add.title}
            disabled={items.length >= props.item.maxItems} />
        })()
      }
    </PlatformContainer>
    <style jsx>{`

      .renderer {
        padding: 0.5rem;
      }
      .error-message {
        /* text-sm text-red-600 pt-2 */
        padding-top: 0.5rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: #DC2626;
      }
    `}</style>
  </React.Fragment >
}
