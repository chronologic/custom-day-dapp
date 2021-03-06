import React from 'react';
import { inject, observer } from 'mobx-react';
import ReactTooltip from 'react-tooltip'

import { NAVIGATION_STEPS } from '../lib/consts';
import StepNavigation from './StepNavigation';


@observer
export default class StepLayout extends React.Component {

  render() {
    const { props: { activeStepKey, onNext, nextTitle, web3Disabled, activeApp }} = this;
    const {
      title,
      description,
      className,
    } = NAVIGATION_STEPS[activeApp][activeStepKey];
    return (
      <section className="steps">
        <StepNavigation activeStep={activeStepKey} activeApp={activeApp} />
        <div className={`steps-content container ${className}`}>
          <div className="about-step">
            <p className="title">{title}</p>
            <p className="description">
              {description}
            </p>
          </div>
          {this.props.children}
        </div>
        <div className="button-container">
          {nextTitle !== null &&
            <button className="button button_fill" onClick={onNext} disabled={web3Disabled} >
            {nextTitle || 'Continue'}
          </button>}
          <span className="guide-span">
            * If you need any additional help, refer to <a href="https://blog.chronologic.network/chronos-platform/home" target="_blank">this guide</a>.
          </span>
        </div>
        <ReactTooltip />
      </section>
    );
  }
}
