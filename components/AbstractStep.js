/* eslint-disable react/require-render-return */
import React from 'react';
import { action } from 'mobx';
import Router from 'next/router';

import { NAVIGATION_STEPS, PROPERTIES as ALL_PROPERTIES } from '../lib/consts';
import InputField from './InputField';

export default class AbstractStep extends React.Component {
  constructor(activeStepKey, activeApp, props) {
    super(props);


    this.activeStepKey = activeStepKey;
    this.activeApp = activeApp;

    this.activeStep = NAVIGATION_STEPS[this.activeApp][this.activeStepKey];
    if (!this.activeStep) {
      throw new Error('No steps with key', this.activeStepKey);
    }
    if (!this.activeStep.propertyKeys) {
      throw new Error('No propertyKeys for step', this.activeStep);
    }
    this.properties = ALL_PROPERTIES.reduce((result, value) => (
      this.activeStep.propertyKeys.includes(value.name) ?
        { ...result, [value.name]: value } :
        result
    ), {});
  }

  async componentDidMount() {
    const {web3Service} = await this.props;
    await web3Service.awaitInitialized();
    this.validatePrevState();
  }


  getValidations() {
    throw new Error('Implement me');
  }

  web3Disabled(web3Service) {
    return !web3Service.connectedToMetaMask || !(typeof web3Service.accounts !== 'undefined' && web3Service.accounts.length > 0)
  }

  async canDeploy() {
    const {web3Service} = this.props;
    await web3Service.awaitInitialized();
    const canDeploy = await web3Service.checkBalance() && await web3Service.checkAllowance();
    return canDeploy;
  }

  async checkDeployable(){
    const{web3Service} = this.props;
    const canDeploy = await this.canDeploy();
    const web3Disabled = await this.web3Disabled(web3Service);
    this.setState(Object.assign(this._state,{deployReady:canDeploy&&!web3Disabled}));
  }

  validatePrevState() {
    const prevProps = [];
    const STEPS = NAVIGATION_STEPS[this.activeApp];
    for (let idx = this.activeStep.idx - 1; idx > 0; idx -= 1) {
      const prevStep = Object.values(STEPS).find(step => step.idx === idx);
      if (prevStep) {
        prevProps.push(...ALL_PROPERTIES.reduce((result, value) => {
          if (prevStep.propertyKeys.includes(value.name)) {
            result.push({ name: value.name, validator: value.validator });
          }
          return result;
        }, []));
      }
    }
    const { props: { store = {} } } = this;
    const { props: { web3Service:{web3} } } = this;
    if (prevProps.some(({ name, validator }) => !store[name] || !validator(store[name],web3))) {
      Router.push('/'+this.activeApp);
    }
  }

  @action
  change(property, event) {
    const { props: { store } } = this;
    const { value,type,checked } = event.target;
    store[property] = (type=='checkbox')? checked: value
    this.validate(property);
  }

  @action
  validate(property) {
    const { props: { store,web3Service } } = this;
    const {web3} = web3Service;
    const validations = this.getValidations();
    const { validator } = this.properties[property];
    const value = store[property];
    validations[property] = validator(value,web3);
    return validations[property];
  }

  goNext = (eventInst) => {
    var target = eventInst.target
    const {web3Service} = this.props;
    if(this.web3Disabled(web3Service) )
      return;
    target.disabled = true;
    const { props: { store } } = this;
    const validations = Object.keys(this.properties).map(property => this.validate(property));
    if (!validations.some(validation => !validation)) {
      const query = ALL_PROPERTIES.reduce((result, { name }) => {
        result[name] = store[name];
        return result;
      }, {});
      Router.push({
        pathname: this.activeStep.nextUrl,
        query,
      });
    }
    else
      target.disabled = false;
  };

  renderProperty(propertyData, otherProps = {}) {
    const { props: { store } } = this;
    const validations = this.getValidations();
    const {
      errorMessage,
      name,
      title,
      description,
      defaultField
    } = propertyData;
    return (
      <InputField
        type="text"
        errorMessage={errorMessage}
        valid={validations[name]}
        title={title}
        value={store[name]}
        info = {description}
        onBlur={() => this.validate(name)}
        onChange={e => this.change(name, e)}
        defaultField={defaultField}
        {...otherProps}
      />
    );
  }

  render() {
    throw new Error('Override me');
  }
}
