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
    var component = componentsLibraries[i](item);

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
      itemProps = _props$item2.props,
      onValuesChanged = props.onValuesChanged,
      hideErrors = props.hideErrors;
  var items = values[id] ? values[id] : [];
  var entryFormProvider = itemProps.entryFormProvider;
  var Component = componentInLibraries({
    componentsLibraries: props.componentsLibraries,
    item: entryFormProvider
  });

  if (!Component) {
    return null;
  }

  var arrayHelpers = props.arrayHelpers;
  var swap = arrayHelpers.swap,
      push = arrayHelpers.push,
      remove = arrayHelpers.remove;

  var onAdd = function onAdd() {
    push(itemProps.placeholder());
  };

  var customOnValueChanged = function customOnValueChanged(value) {
    var id = props.item.id;

    var _values = _extends({}, props.values);

    _values[id] = value;
    onValuesChanged && onValuesChanged(_values);
  };

  return /*#__PURE__*/React__default.createElement("div", null, items && items.length > 0 && items.map(function (entry, index) {
    var itemId = id + "." + index;
    return /*#__PURE__*/React__default.createElement("div", {
      key: index,
      className: "form-control mb-4 " + className
    }, /*#__PURE__*/React__default.createElement(formik.Field, {
      type: entryFormProvider.type,
      name: itemId
    }, function (_ref3) {

      var onRemoveRequired = function onRemoveRequired() {
        remove(index);

        var _i = [].concat(items);

        _i.splice(index, 1);

        customOnValueChanged(_i);
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
        customOnValueChanged(_i);
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
        customOnValueChanged(_i);
      };

      var onEntryValuesChanged = function onEntryValuesChanged(value) {
        var _i = [].concat(items);

        _i[index] = value;
        customOnValueChanged(_i);
      };

      return /*#__PURE__*/React__default.createElement(Component, _extends({}, props, {
        value: entry,
        arrayHelpers: arrayHelpers,
        onMoveDownRequired: onMoveDownRequired,
        onMoveUpRequired: onMoveUpRequired,
        onRemoveRequired: onRemoveRequired,
        item: entryFormProvider,
        index: index,
        canMoveUp: itemProps.canMove && index > 0,
        canMoveDown: itemProps.canMove && index < items.length - 1,
        canRemove: itemProps.canRemove,
        showControls: itemProps.showControls
      }, itemProps.entryFormProvider.props, {
        customOnValueChanged: onEntryValuesChanged
      }));
    }), !hideErrors ? /*#__PURE__*/React__default.createElement(formik.ErrorMessage, {
      name: itemId,
      component: "div",
      className: "text-sm text-red-600 pt-2"
    }) : null);
  }), itemProps.canAddItems && items.length < itemProps.maxItems && /*#__PURE__*/React__default.createElement("div", {
    className: "flex justify-center my-10"
  }, itemProps.addComponent ? itemProps.addComponent({
    onClick: onAdd
  }) : /*#__PURE__*/React__default.createElement("button", {
    type: "button",
    onClick: onAdd
  }, "+")));
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
      onValuesChanged = props.onValuesChanged,
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

    var customOnValueChanged = function customOnValueChanged(value) {
      console.log('customOnValueChanged', value);

      if (!props.item.id) {
        return;
      }

      var id = props.item.id,
          setFieldValue = props.setFieldValue,
          setFieldTouched = props.setFieldTouched;

      var _values = _extends({}, props.values);

      _values[id] = value;
      onValuesChanged && onValuesChanged(_values);
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
      customOnValueChanged: customOnValueChanged
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
  var cache = disableCache ? null : props.cache ? props.cache : React.useRef(new FormulaikCache()).current;

  var onValuesChanged = function onValuesChanged(values) {
    props.onValuesChanged && props.onValuesChanged(values);
    console.log('onValuesChanged hook');
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
