import React from 'react'
import { CSSTransition } from 'react-transition-group'

export default function wrapAnimation(WrappedComponent: any): any {
  return class extends React.Component {
    render() {
      const { match } = this.props as any
      return (
        <CSSTransition
          in={match !== null}
          classNames={{
            enter: 'animate__animated',
            enterActive: 'animate__fadeIn',
            exit: 'animate__animated',
            exitActive: 'animate__fadeOut'
          }}
          timeout={1000}
          mountOnEnter={true}
          unmountOnExit={true}
        >
          <WrappedComponent {...this.props} />
        </CSSTransition>
      )
    }
  }
}
