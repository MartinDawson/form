/* eslint-disable no-undef, react/prop-types, react/no-multi-comp, react/prefer-stateless-function */

import React from 'react';
import ReactDOM from 'react-dom';
import createForm from '../src/createForm';

class MyInput extends React.Component {
  onChange = ({ target: { value } }) => {
    const { onChange } = this.props;
    onChange(value.split(','));
  };
  render() {
    const { value = [] } = this.props;
    return (
      <input {...this.props} onChange={this.onChange} value={value.join(',')} />
    );
  }
}

class Test extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        {getFieldDecorator('url_array', {
          initialValue: ['test'],
          rules: [{ required: true, message: 'The tags must be urls', type: 'array', defaultField: { type: 'url' } }],
        })(
          <MyInput />
        )}
      </div>
    );
  }
}

Test = createForm({
  withRef: true,
})(Test);

describe('validate array type', () => {
  let container;
  let component;
  let form;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    component = ReactDOM.render(<Test />, container);
    component = component.refs.wrappedComponent;
    form = component.props.form;
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  });

  it('forceValidate works', (done) => {
    form.validateFields((errors) => {
      expect(errors).toBeTruthy();
      expect(errors.url_array.errors).toEqual([
        {
          field: 'url_array.0',
          message: 'url_array.0 is not a valid url',
        },
      ]);
      done();
    });
  });
});
