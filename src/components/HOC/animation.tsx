import React from 'react'
import { CSSTransition } from 'react-transition-group'

export default function wrapAnimation(WrappedComponent: any): any {
  return class extends React.Component {
    render() {
      console.log("passing by")
      const { match } = this.props as any
      return (
        <CSSTransition
          in={match !== null}
          classNames={{
            enter: 'animated',
            enterActive: 'fadeIn',
            exit: 'animated',
            exitActive: 'fadeOut'
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
