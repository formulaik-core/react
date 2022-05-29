function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var formik = require('formik');
var nanoid = require('nanoid');

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

var componentInLibraries = (function (props) {
  var _props$componentsLibr = props.componentsLibraries,
      componentsLibraries = _props$componentsLibr === void 0 ? [function () {
    return null;
  }] : _props$componentsLibr,
      item = props.item;

  for (var i = 0; i < componentsLibraries.length; i++) {
    var library = componentsLibraries[i];

    if (!library) {
      continue;
    }

    if (typeof library !== 'function') {
      console.log('is not function', library);
      continue;
    }

    var component = library(item);

    if (component) {
      return component;
    }
  }

  return null;
});

var FieldArray = (function (props) {
  var _props$item = props.item,
      type = _props$item.type,
      id = _props$item.id,
      label = _props$item.label,
      _props$item$forceLabe = _props$item.forceLabel,
      forceLabel = _props$item$forceLabe === void 0 ? false : _props$item$forceLabe,
      _props$item$className = _props$item.className,
      className = _props$item$className === void 0 ? "" : _props$item$className,
      hideErrors = props.hideErrors;
  return /*#__PURE__*/React__default.createElement("div", {
    className: "form-control mb-4 " + className
  }, label && forceLabel && /*#__PURE__*/React__default.createElement("label", {
    className: "label"
  }, /*#__PURE__*/React__default.createElement("span", null, label)), /*#__PURE__*/React__default.createElement(formik.FieldArray, {
    type: type,
    name: id,
    component: function component(arrayHelpers) {
      return render(_extends({}, props, {
        arrayHelpers: arrayHelpers
      }));
    }
  }), !hideErrors ? /*#__PURE__*/React__default.createElement(ErrorMessage, {
    name: id,
    component: "div",
    className: "text-sm text-red-600 pt-2"
  }) : null);
});

var ErrorMessage = function ErrorMessage(_ref) {
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
};

var render = function render(props) {
  var values = props.values,
      _props$item2 = props.item,
      id = _props$item2.id,
      _props$item2$classNam = _props$item2.className,
      className = _props$item2$classNam === void 0 ? "" : _props$item2$classNam,
      params = _props$item2.params,
      container = _props$item2.container,
      add = _props$item2.add,
      hideErrors = props.hideErrors;
  var items = values[id] ? values[id] : [];

  var _cachedValues = React.useRef(props.values);

  var Component = componentInLibraries({
    componentsLibraries: props.componentsLibraries,
    item: params
  });

  if (!Component) {
    return null;
  }

  var arrayHelpers = props.arrayHelpers;
  var swap = arrayHelpers.swap,
      push = arrayHelpers.push,
      remove = arrayHelpers.remove;

  var onAdd = function onAdd() {
    push(params.params.placeholder());
  };

  var onValueChanged = function onValueChanged(value) {
    var id = props.item.id;

    var _values = _extends({}, props.values);

    _values[id] = value;
    _cachedValues.current = _extends({}, _values);
    props._onValueChanged && props._onValueChanged({
      id: id,
      value: value
    });
  };

  var ContainerComponent = componentInLibraries({
    componentsLibraries: props.componentsLibraries,
    item: container
  });

  if (!ContainerComponent) {
    ContainerComponent = function ContainerComponent(_ref3) {
      var children = _ref3.children;
      return /*#__PURE__*/React__default.createElement("div", null, children);
    };
  }

  var AddComponent = componentInLibraries({
    componentsLibraries: props.componentsLibraries,
    item: add
  });

  if (!AddComponent) {
    AddComponent = function AddComponent(_ref4) {
      var onClick = _ref4.onClick,
          title = _ref4.title,
          disabled = _ref4.disabled;
      return /*#__PURE__*/React__default.createElement("div", {
        className: "flex justify-center my-10"
      }, /*#__PURE__*/React__default.createElement("button", {
        disabled: disabled,
        type: "button",
        onClick: onClick
      }, title ? title : "Add"));
    };
  }

  return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement("div", {
    className: "w-full overflow-x-scroll " + (props.item.isHorizontal ? 'flex gap-2 pb-8' : '')
  }, items && items.length > 0 && items.map(function (entry, index) {
    var itemId = id + "." + index;
    return /*#__PURE__*/React__default.createElement("div", {
      key: index,
      className: "form-control " + (!props.item.isHorizontal ? 'mb-4' : '') + "  " + className
    }, /*#__PURE__*/React__default.createElement(formik.Field, {
      type: params.type,
      name: itemId
    }, function (_ref5) {

      var onRemoveRequired = function onRemoveRequired() {
        remove(index);

        var _i = [].concat(items);

        _i.splice(index, 1);

        onValueChanged(_i);
      };

      var onMoveDownRequired = function onMoveDownRequired() {
        if (items.length <= index) {
          return;
        }

        swap(index, index + 1);

        var _i = [].concat(items);

        var object = _i[index];
        var other = _i[index + 1];
        _i[index] = other;
        _i[index + 1] = object;
        onValueChanged(_i);
      };

      var onMoveUpRequired = function onMoveUpRequired() {
        if (index === 0) {
          return;
        }

        swap(index, index - 1);

        var _i = [].concat(items);

        var object = _i[index];
        var other = _i[index - 1];
        _i[index] = other;
        _i[index - 1] = object;
        onValueChanged(_i);
      };

      var onEntryValuesChanged = function onEntryValuesChanged(value) {
        var _i = [].concat(items);

        _i[index] = value;
        onValueChanged(_i);
      };

      var disabled = props.isSubmitting || props.disabled || props.item && props.item.disabled;
      var readOnly = props.readOnly || props.props && props.props.readOnly;
      return /*#__PURE__*/React__default.createElement(ContainerComponent, _extends({}, container, {
        arrayHelpers: arrayHelpers,
        onMoveDownRequired: onMoveDownRequired,
        onMoveUpRequired: onMoveUpRequired,
        onRemoveRequired: onRemoveRequired,
        canMoveUp: props.item.canMove && index > 0,
        canMoveDown: props.item.canMove && index < items.length - 1,
        canRemove: props.item.canRemove,
        showControls: props.item.showControls,
        index: index,
        value: entry
      }), /*#__PURE__*/React__default.createElement(Component, _extends({}, props, {
        disabled: disabled,
        readOnly: readOnly,
        value: entry
      }, params.params, {
        onValueChanged: onEntryValuesChanged
      })));
    }), !hideErrors ? /*#__PURE__*/React__default.createElement(formik.ErrorMessage, {
      name: itemId,
      component: "div",
      className: "text-sm text-red-600 pt-2"
    }) : null);
  })), !props.disabled && props.item.canAddItems && items.length < props.item.maxItems && /*#__PURE__*/React__default.createElement(AddComponent, {
    onClick: onAdd,
    title: add.title,
    disabled: items.length >= props.item.maxItems
  }));
};

var Field = (function (props) {
  var _props$item = props.item,
      type = _props$item.type,
      id = _props$item.id,
      label = _props$item.label,
      _props$item$isDependa = _props$item.isDependant,
      isDependant = _props$item$isDependa === void 0 ? false : _props$item$isDependa,
      _props$item$forceLabe = _props$item.forceLabel,
      forceLabel = _props$item$forceLabe === void 0 ? false : _props$item$forceLabe,
      _props$item$className = _props$item.className,
      className = _props$item$className === void 0 ? "" : _props$item$className,
      hideErrors = props.hideErrors;
  var Component = componentInLibraries({
    componentsLibraries: props.componentsLibraries,
    item: props.item
  });

  if (!Component) {
    return null;
  }

  var _id = id ? id : nanoid.nanoid();

  var Renderer = isDependant ? formik.Field : formik.FastField;

  var _props = _extends({}, props);

  return /*#__PURE__*/React__default.createElement("div", {
    className: "mb-8 " + className
  }, label && forceLabel && /*#__PURE__*/React__default.createElement("label", {
    className: "label"
  }, /*#__PURE__*/React__default.createElement("span", null, label)), /*#__PURE__*/React__default.createElement(Renderer, {
    type: type,
    name: _id
  }, function (_ref) {
    var field = _ref.field,
        form = _ref.form;

    var onValueChanged = function onValueChanged(value) {
      console.log('onValueChanged', value);

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
      setFieldValue(id, value, true);
      setFieldTouched(id, true, false);
    };

    var disabled = props.isSubmitting || props.disabled || props.item && props.item.disabled;
    var readOnly = props.readOnly || props.props && props.props.readOnly;
    return /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(Component, _extends({}, props, {
      disabled: disabled,
      readOnly: readOnly,
      value: props.values[id],
      error: props.errors[id],
      field: field,
      form: form,
      onValueChanged: onValueChanged
    })), !hideErrors && id ? /*#__PURE__*/React__default.createElement("div", {
      className: " my-2 mb-4 px-2 rounded-b-lg"
    }, /*#__PURE__*/React__default.createElement(formik.ErrorMessage, {
      name: _id,
      component: "div",
      className: "text-sm text-red-500 "
    })) : null);
  }));
});

var generate = function generate(props) {
  var inputs = props.inputs;
  var items = Array.isArray(inputs) ? inputs : inputs();
  return /*#__PURE__*/React__default.createElement(formik.Form, null, items.map(function (item) {
    var isMulti = item.isMulti;

    if (isMulti) {
      return _generateItemsView(_extends({}, props, {
        item: item
      }));
    }

    return _generateItemView(_extends({}, props, {
      item: item
    }));
  }));
};

var _generateItemsView = function _generateItemsView(props) {
  var _props$item = props.item,
      className = _props$item.className,
      items = _props$item.items;
  return /*#__PURE__*/React__default.createElement("div", {
    className: className
  }, items.map(function (_item) {
    return _generateItemView(_extends({}, props, {
      item: _item
    }));
  }));
};

var _generateItemView = function _generateItemView(props) {
  var item = props.item;

  if (item.hide) {
    return null;
  }

  if (item.isList) {
    return /*#__PURE__*/React__default.createElement(FieldArray, props);
  }

  return /*#__PURE__*/React__default.createElement(Field, props);
};

var FormulaikCache = /*#__PURE__*/function () {
  function FormulaikCache(props) {
    var _this = this;

    this._data = {};

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
  }

  _createClass(FormulaikCache, [{
    key: "data",
    get: function get() {
      return this._data;
    },
    set: function set(value) {
      this._data = value;
    }
  }]);

  return FormulaikCache;
}();

var index = (function (props) {
  var onSubmit = props.onSubmit,
      error = props.error,
      onFormPropsChanged = props.onFormPropsChanged,
      _props$disableCache = props.disableCache,
      disableCache = _props$disableCache === void 0 ? false : _props$disableCache,
      _props$hideErrors = props.hideErrors,
      hideErrors = _props$hideErrors === void 0 ? false : _props$hideErrors,
      _props$disabled = props.disabled,
      disabled = _props$disabled === void 0 ? false : _props$disabled,
      _props$readOnly = props.readOnly,
      readOnly = _props$readOnly === void 0 ? false : _props$readOnly;
  var initialValues = typeof props.initialValues !== 'function' ? props.initialValues : props.initialValues && props.initialValues();
  var validationSchema = typeof props.validationSchema !== 'function' ? props.validationSchema : props.validationSchema && props.validationSchema();
  var changedValues = React.useRef(initialValues);
  var cache = disableCache ? null : props.cache ? props.cache : React.useRef(new FormulaikCache()).current;

  var onValuesChanged = function onValuesChanged(values) {
    changedValues.current = values;
    props.onValuesChanged && props.onValuesChanged(values);
    console.log('onValuesChanged hook');
  };

  var _onValueChanged = function _onValueChanged(_ref) {
    var id = _ref.id,
        value = _ref.value;

    var values = _extends({}, changedValues.current);

    values[id] = value;
    onValuesChanged(values);
  };

  return /*#__PURE__*/React__default.createElement("div", {
    className: ""
  }, /*#__PURE__*/React__default.createElement(formik.Formik, {
    initialValues: initialValues,
    validationSchema: validationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: onSubmit
  }, function (formProps) {
    onFormPropsChanged && onFormPropsChanged(formProps);
    return generate(_extends({}, formProps, props, {
      initialValues: initialValues,
      validationSchema: validationSchema,
      onValuesChanged: onValuesChanged,
      _onValueChanged: _onValueChanged,
      cache: cache,
      disableCache: disableCache,
      disabled: disabled,
      readOnly: readOnly,
      hideErrors: hideErrors
    }));
  }), error && /*#__PURE__*/React__default.createElement("div", {
    className: "alert alert-error mb-4"
  }, /*#__PURE__*/React__default.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React__default.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    className: "w-6 h-6 mx-2 stroke-current"
  }, /*#__PURE__*/React__default.createElement("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "2",
    d: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
  })), /*#__PURE__*/React__default.createElement("label", null, error.message))));
});

module.exports = index;
//# sourceMappingURL=index.js.map
