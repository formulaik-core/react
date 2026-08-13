function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var formik = require('formik');
var ReactDOM = require('react-dom');
var nanoid = require('nanoid');
var schemaToYup = require('schema-to-yup');

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

var componentResolver = (function (props) {
  var item = props.item,
      cache = props.cache,
      index = props.index,
      entry = props.entry;

  var _components = props.components ? props.components : props.componentsLibraries;

  if (!_components) {
    _components = [function () {
      return null;
    }];
  }

  var type = null;
  var typer = item.component ? item.component : item.type;

  if (typeof typer === 'function') {
    type = typer({
      index: index,
      entry: entry
    });
  } else {
    type = typer;
  }

  if (!type) {
    return null;
  }

  if (cache) {
    var _cached = cache.getComponent({
      key: type
    });

    if (_cached) {
      return _cached;
    }
  }

  for (var i = 0; i < _components.length; i++) {
    var library = _components[i];

    if (!library) {
      continue;
    }

    if (typeof library !== 'function') {
      console.log('is not function', library);
      continue;
    }

    var component = library(_extends({}, item, {
      type: type
    }));

    if (component) {
      if (cache) {
        cache.addComponent({
          component: component,
          key: type
        });
      }

      return component;
    }
  }

  return null;
});

var PlatformButton = (function (props) {
  var children = props.children;
  return /*#__PURE__*/React__default.createElement("button", props, children);
});

var PlatformContainer = (function (props) {
  var children = props.children;
  return /*#__PURE__*/React__default.createElement("div", props, children);
});

var AddButton = (function (_ref) {
  var onAdd = _ref.onAdd,
      title = _ref.title,
      disabled = _ref.disabled;
  return /*#__PURE__*/React__default.createElement(PlatformContainer, {
    style: {
      "display": "flex",
      "marginTop": "2.5rem",
      "marginBottom": "2.5rem",
      "justifyContent": "center"
    }
  }, /*#__PURE__*/React__default.createElement(PlatformButton, {
    disabled: disabled,
    type: "button",
    onClick: onAdd
  }, title ? title : "Add"));
});

var render = (function (props) {
  var initialValues = props.initialValues,
      _props$item = props.item,
      id = _props$item.id,
      _props$item$className = _props$item.className,
      className = _props$item$className === void 0 ? "" : _props$item$className,
      params = _props$item.params,
      container = _props$item.container,
      add = _props$item.add,
      preferInitialValues = _props$item.preferInitialValues,
      _props$item$isDependa = _props$item.isDependant,
      isDependant = _props$item$isDependa === void 0 ? false : _props$item$isDependa,
      portalContainersRef = _props$item.portalContainersRef,
      containersProps = props.containersProps,
      hideErrors = props.hideErrors;

  var _items = preferInitialValues ? initialValues[id] : props.valuesRef.current[id] ? props.valuesRef.current[id] : null;

  if (!_items) {
    _items = [];
  }

  var _useState = React.useState(_items),
      items = _useState[0],
      setItems = _useState[1];

  var AddComponent = add && add.component ? add.component : componentResolver(_extends({}, props, {
    components: props.components,
    item: add
  }));

  if (!AddComponent) {
    AddComponent = AddButton;
  }

  var arrayHelpers = props.arrayHelpers;
  var swap = arrayHelpers.swap,
      push = arrayHelpers.push,
      remove = arrayHelpers.remove;

  var onAdd = function onAdd(toAdd) {
    try {
      var _temp4 = function _temp4() {
        var _i = [].concat(items, [newItem]);

        onValueChanged(_i, {
          resetItems: false,
          operation: {
            type: 'add'
          },
          item: _extends({}, newItem),
          index: _i.length - 1
        });
        push(newItem);
      };

      var newItem = null;

      var _temp5 = function () {
        if (toAdd && (!toAdd.type || toAdd.type !== 'click')) {
          newItem = toAdd;
        } else {
          var _temp6 = function () {
            if (params.params.placeholder) {
              return Promise.resolve(params.params.placeholder()).then(function (_params$params$placeh) {
                newItem = _params$params$placeh;
              });
            }
          }();

          if (_temp6 && _temp6.then) return _temp6.then(function () {});
        }
      }();

      return Promise.resolve(_temp5 && _temp5.then ? _temp5.then(_temp4) : _temp4(_temp5));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var onValueChanged = function onValueChanged(value, params) {
    var _ref = params ? params : {},
        _ref$resetItems = _ref.resetItems,
        resetItems = _ref$resetItems === void 0 ? false : _ref$resetItems;

    var id = props.item.id;

    var _values = _extends({}, props.valuesRef.current);

    _values[id] = value;

    if (props._onValueChanged) {
      props._onValueChanged({
        id: id,
        value: value
      }, _extends({}, params));
    }

    !resetItems && setItems(value);
  };

  var Renderer = isDependant ? formik.Field : formik.FastField;
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(PlatformContainer, {
    "data-id": "array-container"
  }, /*#__PURE__*/React__default.createElement(PlatformContainer, {
    "data-id": "array-container-content",
    style: _extends({
      overflowX: "scroll",
      width: "100%"
    }, props.item.isHorizontal && {
      "display": "flex",
      "paddingBottom": "2rem",
      "gap": "0.5rem"
    })
  }, items && items.length > 0 && items.map(function (entry, index) {
    var itemId = id + "." + index;
    var ContainerComponent = componentResolver(_extends({}, props, {
      components: props.components,
      item: container,
      index: index,
      entry: entry
    }));

    if (!ContainerComponent) {
      ContainerComponent = function ContainerComponent(_ref2) {
        var children = _ref2.children;
        return /*#__PURE__*/React__default.createElement(PlatformContainer, null, children);
      };
    }

    var Component = componentResolver(_extends({}, props, {
      components: props.components,
      item: params,
      index: index,
      entry: entry
    }));

    if (!Component) {
      return null;
    }

    return /*#__PURE__*/React__default.createElement(PlatformContainer, {
      "data-id": "array-container-content-entry",
      key: index,
      className: "form-control " + className
    }, /*#__PURE__*/React__default.createElement(Renderer, {
      "data-id": "array-renderer",
      className: 'renderer',
      type: params.type,
      name: itemId
    }, function (_ref3) {

      var onRemoveRequired = function onRemoveRequired() {
        remove(index);

        var _i = [].concat(props.valuesRef.current[id]);

        var object = _i[index];

        _i.splice(index, 1);

        onValueChanged(_i, {
          resetItems: false,
          operation: {
            type: 'remove'
          },
          item: object,
          index: index
        });
      };

      var onMoveDownRequired = function onMoveDownRequired() {
        if (items.length <= index) {
          return;
        }

        swap(index, index + 1);

        var _i = [].concat(props.valuesRef.current[id]);

        var object = _i[index];
        var other = _i[index + 1];
        _i[index] = other;
        _i[index + 1] = object;
        onValueChanged(_i, {
          resetItems: false,
          operation: {
            type: 'moveDown'
          },
          item: object,
          index: index
        });
      };

      var onMoveUpRequired = function onMoveUpRequired() {
        if (index === 0) {
          return;
        }

        swap(index, index - 1);

        var _i = [].concat(props.valuesRef.current[id]);

        var object = _i[index];
        var other = _i[index - 1];
        _i[index] = other;
        _i[index - 1] = object;
        onValueChanged(_i, {
          resetItems: false,
          operation: {
            type: 'moveUp'
          },
          item: object,
          index: index
        });
      };

      var onEntryValuesChanged = function onEntryValuesChanged(value, params) {
        var _i = [].concat(props.valuesRef.current[id]);

        _i[index] = value;
        onValueChanged(_i, params);
      };

      var disabled = props.isSubmitting || props.disabled || props.item && props.item.disabled;
      var readOnly = props.readOnly || props.props && props.props.readOnly;

      var adaptedProps = _extends({}, props);

      adaptedProps.item = _extends({}, adaptedProps.item, {
        params: adaptedProps.item.params
      });

      var onContainerPropsChanged = function onContainerPropsChanged(containerProps) {
        props.onContainerPropsChanged({
          id: itemId,
          props: containerProps
        });
      };

      var containerClassName = function containerClassName() {
        if (!container.className) {
          return '';
        }

        if (typeof container.className !== 'function') {
          return container.className;
        }

        var className = container.className({
          index: index,
          entry: entry
        });
        return className;
      };

      if (portalContainersRef && portalContainersRef.current) {
        if (!portalContainersRef.current.length || index >= portalContainersRef.current.length) {
          return null;
        }

        var portalContainer = portalContainersRef.current[index];

        if (!portalContainer) {
          return null;
        }

        return ReactDOM.createPortal( /*#__PURE__*/React__default.createElement(ContainerComponent, _extends({}, container, props.item, {
          className: containerClassName(),
          arrayHelpers: arrayHelpers,
          onMoveDownRequired: onMoveDownRequired,
          onMoveUpRequired: onMoveUpRequired,
          onRemoveRequired: onRemoveRequired,
          canMoveUp: props.item.canMove && index > 0,
          canMoveDown: props.item.canMove && index < items.length - 1,
          canRemove: props.item.canRemove,
          showControls: props.item.showControls,
          index: index,
          value: entry,
          containerProps: containersProps[itemId],
          onContainerPropsChanged: onContainerPropsChanged
        }), /*#__PURE__*/React__default.createElement(Component, _extends({}, adaptedProps, {
          disabled: disabled,
          readOnly: readOnly,
          value: entry,
          onValueChanged: onEntryValuesChanged
        }))), portalContainer);
      } else {
        return /*#__PURE__*/React__default.createElement(ContainerComponent, _extends({}, container, props.item, {
          className: containerClassName(),
          arrayHelpers: arrayHelpers,
          onMoveDownRequired: onMoveDownRequired,
          onMoveUpRequired: onMoveUpRequired,
          onRemoveRequired: onRemoveRequired,
          canMoveUp: props.item.canMove && index > 0,
          canMoveDown: props.item.canMove && index < items.length - 1,
          canRemove: props.item.canRemove,
          showControls: props.item.showControls,
          index: index,
          value: entry,
          containerProps: containersProps[itemId],
          onContainerPropsChanged: onContainerPropsChanged
        }), /*#__PURE__*/React__default.createElement(Component, _extends({}, adaptedProps, {
          disabled: disabled,
          readOnly: readOnly,
          value: entry,
          onValueChanged: onEntryValuesChanged
        })));
      }
    }), !hideErrors ? /*#__PURE__*/React__default.createElement(formik.ErrorMessage, {
      name: itemId,
      component: "div",
      className: "error-message"
    }) : null);
  })), !props.disabled && props.item.canAddItems && items.length < props.item.maxItems && function () {
    if (add.portalContainer) {
      if (!add.portalContainer.current) {
        return null;
      }

      return ReactDOM.createPortal( /*#__PURE__*/React__default.createElement(AddComponent, {
        onAdd: onAdd,
        title: add.title,
        disabled: items.length >= props.item.maxItems
      }), add.portalContainer.current);
    }

    return /*#__PURE__*/React__default.createElement(AddComponent, {
      onAdd: onAdd,
      title: add.title,
      disabled: items.length >= props.item.maxItems
    });
  }()), /*#__PURE__*/React__default.createElement("style", {
    jsx: true
  }, "\n\n      .renderer {\n        padding: 0.5rem;\n      }\n      .error-message {\n        /* text-sm text-red-600 pt-2 */\n        padding-top: 0.5rem;\n        font-size: 0.875rem;\n        line-height: 1.25rem;\n        color: #DC2626;\n      }\n    "));
});

var ErrorMessage = (function (_ref) {
  var name = _ref.name;
  return /*#__PURE__*/React__default.createElement(formik.Field, {
    name: name,
    render: function render(_ref2) {
      var form = _ref2.form;
      var error = formik.getIn(form.errors, name);
      var touch = formik.getIn(form.touched, name);
      return touch && error ? error : null;
    }
  });
});

var PlatformText = (function (props) {
  var children = props.children;
  return /*#__PURE__*/React__default.createElement("p", props, children);
});

var Label = function Label(props) {
  var _props$item = props.item,
      label = _props$item.label,
      hideLabel = _props$item.hideLabel;

  if (hideLabel || !label) {
    return null;
  }

  var Result = label;

  if (typeof label === 'function') {
    Result = label(_extends({}, props));
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(PlatformContainer, {
    style: {
      marginBottom: "0.5rem"
    }
  }, typeof Result === 'string' ? /*#__PURE__*/React__default.createElement(PlatformText, {
    style: {}
  }, Result) : null, typeof Result === 'function' ? /*#__PURE__*/React__default.createElement(Result, null) : null));
};

var Caption = function Caption(props) {
  var _props$item = props.item,
      caption = _props$item.caption,
      hideCaption = _props$item.hideCaption;

  if (hideCaption || !caption) {
    return null;
  }

  var Result = caption;

  if (typeof caption === 'function') {
    Result = caption(_extends({}, props));
  }

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(PlatformContainer, {
    style: {
      marginBottom: "0.5rem"
    }
  }, typeof Result === 'string' ? /*#__PURE__*/React__default.createElement(PlatformText, {
    style: {
      fontSize: 12
    }
  }, Result) : null, typeof Result === 'function' ? /*#__PURE__*/React__default.createElement(Result, null) : null));
};

var ArrayField = (function (props) {
  var _props$item = props.item,
      input = _props$item.input,
      type = _props$item.type,
      id = _props$item.id,
      _props$item$className = _props$item.className,
      className = _props$item$className === void 0 ? "" : _props$item$className,
      hideErrors = props.hideErrors;

  var _type = input ? input : type;

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(PlatformContainer, {
    className: "" + className,
    "data-id": "array-index"
  }, /*#__PURE__*/React__default.createElement(Label, props), /*#__PURE__*/React__default.createElement(formik.FieldArray, {
    type: _type,
    name: id,
    component: function component(arrayHelpers) {
      return render(_extends({}, props, {
        arrayHelpers: arrayHelpers
      }));
    }
  }), /*#__PURE__*/React__default.createElement(Caption, props), !hideErrors ? /*#__PURE__*/React__default.createElement(ErrorMessage, {
    name: id,
    component: "div",
    className: "error-message"
  }) : null), /*#__PURE__*/React__default.createElement("style", {
    jsx: true
  }, "\n      .error-message {\n        padding-top: 0.5rem;\n        font-size: 0.875rem;\n        line-height: 1.25rem;\n        color: #DC2626;\n      }\n    "));
});

var SingleField = (function (props) {
  var _props$item = props.item,
      type = _props$item.type,
      id = _props$item.id,
      _props$item$isDependa = _props$item.isDependant,
      isDependant = _props$item$isDependa === void 0 ? false : _props$item$isDependa,
      hideErrors = props.hideErrors;

  var _type = props.component ? props.component : type;

  var Component = componentResolver(_extends({}, props, {
    components: props.components,
    item: props.item
  }));

  if (!Component) {
    return null;
  }

  var _id = id ? id : nanoid.nanoid();

  var Renderer = isDependant ? formik.Field : formik.FastField;
  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(PlatformContainer, {
    style: {
      marginBottom: "1rem"
    }
  }, /*#__PURE__*/React__default.createElement(Label, props), /*#__PURE__*/React__default.createElement(Renderer, {
    type: _type,
    name: _id
  }, function (_ref) {
    var field = _ref.field,
        form = _ref.form;

    var onValueChanged = function onValueChanged(value, params) {
      var _ref2 = params ? params : {},
          _ref2$resetItems = _ref2.resetItems,
          resetItems = _ref2$resetItems === void 0 ? false : _ref2$resetItems;

      if (!props.item.id) {
        return;
      }

      var id = props.item.id,
          setFieldValue = props.setFieldValue,
          setFieldTouched = props.setFieldTouched;
      props._onValueChanged && props._onValueChanged({
        id: id,
        value: value
      });
      !resetItems && setFieldValue(id, value, true);
      !resetItems && setFieldTouched(id, true, false);
    };

    var disabled = props.isSubmitting || props.disabled || props.item && props.item.disabled;
    var readOnly = props.readOnly || props.props && props.props.readOnly;
    return /*#__PURE__*/React__default.createElement("div", {
      key: _id
    }, /*#__PURE__*/React__default.createElement(Component, _extends({}, props, {
      disabled: disabled,
      readOnly: readOnly,
      value: props.values[id],
      error: props.errors[id],
      field: field,
      form: form,
      onValueChanged: onValueChanged
    })), !hideErrors && id && /*#__PURE__*/React__default.createElement(PlatformContainer, {
      style: {
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        marginTop: "0.5rem",
        marginBottom: "1rem",
        borderBottomRightRadius: "0.5rem",
        borderBottomLeftRadius: "0.5rem"
      }
    }, /*#__PURE__*/React__default.createElement(formik.ErrorMessage, {
      name: _id,
      component: "div",
      className: "error-message"
    })));
  }), /*#__PURE__*/React__default.createElement(Caption, props)), /*#__PURE__*/React__default.createElement("style", {
    jsx: true
  }, "\n      .error-message {\n        margin-top: 1.5rem;\n        text-align: center;\n        color: #DC2626;\n      }\n    "));
});

var fields = (function (props) {
  var inputs = props.inputs;
  var items = Array.isArray(inputs) ? inputs : inputs();
  return /*#__PURE__*/React__default.createElement(formik.Form, null, items.map(function (item) {
    var isMulti = item.isMulti;

    if (isMulti) {
      return renderMultiItems(_extends({}, props, {
        item: item
      }));
    }

    return renderItem(_extends({}, props, {
      item: item
    }));
  }));
});

var renderMultiItems = function renderMultiItems(props) {
  var _props$item = props.item,
      className = _props$item.className,
      items = _props$item.items;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "#TODO -mb-2 " + className
  }, items.map(function (_item) {
    return renderItem(_extends({}, props, {
      item: _item
    }));
  }));
};

var renderItem = function renderItem(props) {
  var item = props.item;

  if (item.hide) {
    return null;
  }

  var portalContainer = item.portalContainer;

  if (item.isList) {
    if (portalContainer) {
      if (!portalContainer.current) {
        return null;
      }

      return ReactDOM.createPortal( /*#__PURE__*/React__default.createElement(ArrayField, props), portalContainer.current);
    } else {
      return /*#__PURE__*/React__default.createElement(ArrayField, props);
    }
  }

  if (portalContainer) {
    if (!portalContainer.current) {
      return null;
    }

    return ReactDOM.createPortal( /*#__PURE__*/React__default.createElement(SingleField, props), portalContainer.current);
  } else {
    return /*#__PURE__*/React__default.createElement(SingleField, props);
  }
};

var FormulaikCache = /*#__PURE__*/function () {
  function FormulaikCache(props) {
    var _this = this;

    this._data = {};
    this._cdata = {};

    this.add = function (_ref) {
      var search = _ref.search,
          results = _ref.results,
          key = _ref.key;

      var _key = key.toLowerCase();

      if (!_this.data[_key]) {
        _this.data[_key] = {};
      }

      _this.data[_key][search] = [].concat(results);
    };

    this.get = function (_ref2) {
      var search = _ref2.search,
          key = _ref2.key;

      var _key = key.toLowerCase();

      if (!_this.data[_key]) {
        return null;
      }

      return _this.data[_key][search];
    };

    this.clear = function () {
      _this.data = {};
    };

    this.addComponent = function (_ref3) {
      var component = _ref3.component,
          key = _ref3.key;

      var _key = key.toLowerCase();

      _this.cdata[_key] = component;
    };

    this.getComponent = function (_ref4) {
      var key = _ref4.key;

      var _key = key.toLowerCase();

      if (!_this.cdata[_key]) {
        return null;
      }

      return _this.cdata[_key];
    };
  }

  _createClass(FormulaikCache, [{
    key: "data",
    get: function get() {
      return this._data;
    },
    set: function set(value) {
      this._data = value;
    }
  }, {
    key: "cdata",
    get: function get() {
      return this._cdata;
    },
    set: function set(value) {
      this._cdata = value;
    }
  }]);

  return FormulaikCache;
}();

var yupFromSchema = (function (_ref) {
  var inputs = _ref.inputs;
  var schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {},
    required: []
  };
  var validatableInputs = inputs.filter(function (a) {
    return a && a.validations;
  });
  var config = {
    errMessages: {}
  };

  for (var _iterator = _createForOfIteratorHelperLoose(validatableInputs), _step; !(_step = _iterator()).done;) {
    var input = _step.value;
    var validations = input.validations;
    var properties = {};
    var messages = {};

    for (var _iterator2 = _createForOfIteratorHelperLoose(validations), _step2; !(_step2 = _iterator2()).done;) {
      var validation = _step2.value;
      var kind = validation.kind;
      properties[kind] = validation.value;
      messages[kind] = validation.message;
    }

    schema.properties[input.id] = _extends({
      type: input.type ? input.type : 'string'
    }, properties);

    if (properties.required) {
      schema.required.push(input.id);
    }

    config.errMessages[input.id] = messages;
  }

  var yupSchema = schemaToYup.buildYup(schema, config);
  return yupSchema;
});

var PlatformLink = (function (props) {
  var children = props.children;
  return /*#__PURE__*/React__default.createElement("a", props, children);
});

var index = (function (props) {
  var onFormPropsChanged = props.onFormPropsChanged,
      _props$disableCache = props.disableCache,
      disableCache = _props$disableCache === void 0 ? false : _props$disableCache,
      _props$hideErrors = props.hideErrors,
      hideErrors = _props$hideErrors === void 0 ? false : _props$hideErrors,
      _props$disabled = props.disabled,
      disabled = _props$disabled === void 0 ? false : _props$disabled,
      _props$readOnly = props.readOnly,
      readOnly = _props$readOnly === void 0 ? false : _props$readOnly,
      children = props.children,
      _props$hideBrand = props.hideBrand,
      hideBrand = _props$hideBrand === void 0 ? false : _props$hideBrand;

  var _useState = React.useState(props.error),
      error = _useState[0],
      setError = _useState[1];

  var _useState2 = React.useState(props.success),
      success = _useState2[0],
      setSuccess = _useState2[1];

  var _initialValues = props.initialValues ? props.initialValues : props.values;

  var initialValues = typeof _initialValues !== 'function' ? _initialValues : props.initialValues && _initialValues();
  var validationSchema = null;

  if (props.validationSchema) {
    validationSchema = typeof props.validationSchema !== 'function' ? props.validationSchema : props.validationSchema && props.validationSchema();
  } else {
    validationSchema = yupFromSchema({
      inputs: props.inputs
    });
  }

  var valuesRef = React.useRef(initialValues ? initialValues : {});
  var cache = disableCache ? null : props.cache ? props.cache : React.useRef(new FormulaikCache()).current;
  var containersProps = React.useRef({});

  var onContainerPropsChanged = function onContainerPropsChanged(_ref) {
    var id = _ref.id,
        containerProps = _ref.props;

    var data = _extends({}, containersProps.current);

    data[id] = containerProps;
    containersProps.current = data;
  };

  var onValuesChanged = function onValuesChanged(values, params) {
    valuesRef.current = values;
    props.onValuesChanged && props.onValuesChanged(values, params);
  };

  var onSubmit = function onSubmit(values, actions) {
    try {
      var _temp3 = function _temp3() {
        setSubmitting(false);
        return result;
      };

      var setValues = actions.setValues;
      setValues(valuesRef.current);
      setError(null);
      setSuccess(null);
      var setSubmitting = actions.setSubmitting;
      setSubmitting(true);
      var result = null;

      var _temp4 = _catch(function () {
        return Promise.resolve(props.onSubmit(valuesRef.current, _extends({}, actions, {
          setError: setError
        }))).then(function (result) {
          var _success = result && result.message ? {
            message: result.message
          } : {};

          setSuccess(_success);
        });
      }, function (e) {
        setError(e);
      });

      return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var _onValueChanged = function _onValueChanged(_ref2, params) {
    var id = _ref2.id,
        value = _ref2.value;

    var values = _extends({}, valuesRef.current);

    values[id] = value;
    onValuesChanged(values, params);
  };

  return /*#__PURE__*/React__default.createElement(React__default.Fragment, null, /*#__PURE__*/React__default.createElement(formik.Formik, {
    initialValues: initialValues,
    validationSchema: validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: onSubmit
  }, function (formProps) {
    onFormPropsChanged && onFormPropsChanged(formProps);
    return fields(_extends({}, formProps, props, {
      initialValues: initialValues,
      validationSchema: validationSchema,
      onValuesChanged: onValuesChanged,
      _onValueChanged: _onValueChanged,
      containersProps: containersProps.current,
      onContainerPropsChanged: onContainerPropsChanged,
      values: valuesRef.current,
      valuesRef: valuesRef,
      cache: cache,
      disableCache: disableCache,
      disabled: disabled,
      readOnly: readOnly,
      hideErrors: hideErrors
    }));
  }), children, /*#__PURE__*/React__default.createElement(PlatformContainer, {
    style: {}
  }, (error || props.error) && /*#__PURE__*/React__default.createElement(PlatformText, {
    style: {
      marginTop: "0.5rem",
      fontWeight: 800,
      color: "red"
    }
  }, error ? error.message : props.error ? props.error.message : ""), success && success.message && /*#__PURE__*/React__default.createElement(PlatformText, {
    style: {
      marginTop: "0.5rem",
      fontWeight: 800,
      color: "green"
    }
  }, success.message)), !hideBrand && /*#__PURE__*/React__default.createElement(PlatformContainer, {
    style: {
      marginTop: "1.5rem"
    }
  }, /*#__PURE__*/React__default.createElement(PlatformText, {
    style: {
      color: "#bababa",
      fontSize: 12
    }
  }, "Made with ", /*#__PURE__*/React__default.createElement(PlatformLink, {
    href: 'https://formulaik-core.github.io/documentation/',
    target: 'blank'
  }, "Formulaik"))));
});

module.exports = index;
//# sourceMappingURL=index.js.map
