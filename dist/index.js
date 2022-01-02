function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var formik = require('formik');

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

var generateFormContent = function generateFormContent(props) {
  var formItemsProvider = props.formItemsProvider;
  var items = Array.isArray(formItemsProvider) ? formItemsProvider : formItemsProvider();
  return /*#__PURE__*/React.createElement(formik.Form, {
    className: "grid grid-flow-row"
  }, items.map(function (item) {
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
  return /*#__PURE__*/React.createElement("div", {
    className: className
  }, items.map(function (_item) {
    return _generateItemView(_extends({}, props, {
      item: _item
    }));
  }));
};

var _generateItemView = function _generateItemView(props) {
  var item = props.item,
      _props$componentsLibr = props.componentsLibraries,
      componentsLibraries = _props$componentsLibr === void 0 ? [function () {
    return null;
  }] : _props$componentsLibr;

  if (item.hide) {
    return null;
  }

  var Component = null;

  for (var i = 0; i < componentsLibraries.length; i++) {
    Component = componentsLibraries[i](item);

    if (Component) {
      break;
    }
  }

  if (!Component) {
    return null;
  }

  return /*#__PURE__*/React.createElement(Wrapper, _extends({}, props, {
    Component: Component
  }));
};

var Wrapper = function Wrapper(props) {
  var _props$item2 = props.item,
      type = _props$item2.type,
      id = _props$item2.id,
      label = _props$item2.label,
      _props$item2$forceLab = _props$item2.forceLabel,
      forceLabel = _props$item2$forceLab === void 0 ? false : _props$item2$forceLab,
      _props$item2$classNam = _props$item2.className,
      className = _props$item2$classNam === void 0 ? "" : _props$item2$classNam,
      Component = props.Component,
      onValuesChanged = props.onValuesChanged;
  return /*#__PURE__*/React.createElement("div", {
    className: "form-control mb-4 " + className
  }, label && forceLabel ? /*#__PURE__*/React.createElement("label", {
    className: "label"
  }, /*#__PURE__*/React.createElement("span", null, label)) : null, /*#__PURE__*/React.createElement(formik.Field, {
    type: type,
    name: id
  }, function (_ref) {
    var field = _ref.field,
        form = _ref.form;

    var customOnValueChanged = function customOnValueChanged(value) {
      var id = props.item.id,
          setFieldValue = props.setFieldValue,
          setFieldTouched = props.setFieldTouched;
      setFieldValue(id, value);
      setFieldTouched(id, true, false);

      var _values = _extends({}, props.values);

      _values[id] = value;
      onValuesChanged && onValuesChanged(_values);
    };

    return /*#__PURE__*/React.createElement(Component, _extends({}, props, {
      field: field,
      form: form,
      customOnValueChanged: customOnValueChanged
    }));
  }), /*#__PURE__*/React.createElement(formik.ErrorMessage, {
    name: id,
    component: "div",
    className: "text-sm text-red-600 pt-2"
  }));
};

var index = (function (props) {
  var onSubmit = props.onSubmit,
      error = props.error;
  var initialValues = typeof props.initialValues !== 'function' ? props.initialValues : props.initialValues && props.initialValues();
  var validationSchema = typeof props.validationSchema !== 'function' ? props.validationSchema : props.validationSchema && props.validationSchema();
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(formik.Formik, {
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit
  }, function (formProps) {
    return generateFormContent(_extends({}, formProps, props, {
      initialValues: initialValues,
      validationSchema: validationSchema
    }));
  }), error ? /*#__PURE__*/React.createElement("div", {
    className: "alert alert-error mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    className: "w-6 h-6 mx-2 stroke-current"
  }, /*#__PURE__*/React.createElement("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "2",
    d: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
  })), /*#__PURE__*/React.createElement("label", null, error.message))) : null);
});

module.exports = index;
//# sourceMappingURL=index.js.map
