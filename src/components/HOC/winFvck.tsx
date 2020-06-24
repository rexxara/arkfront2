import React from 'react'
import { CSSTransition } from 'react-transition-group'

// State of the HOC you need to compute the InjectedProps
interface State {
}

// Props you want the resulting component to take (besides the props of the wrapped component)
interface ExternalProps {
    match:string|null
}

// Props the HOC adds to the wrapped component
export interface InjectedProps {
}

// Options for the HOC factory that are not dependent on props values


export const yourHocFactoryName = (fvck:any) =>
    <TOriginalProps extends {}>(
        Component: (React.ComponentClass<TOriginalProps & InjectedProps>
            | React.StatelessComponent<TOriginalProps & InjectedProps>)
    ) => {
        // Do something with the options here or some side effects

        type ResultProps = TOriginalProps & ExternalProps;
        const result = class YourComponentName extends React.Component<ResultProps, State> {
            // Define how your HOC is shown in ReactDevTools
            static displayName = `YourComponentName(${Component.displayName || Component.name})`;

            constructor(props: ResultProps) {
                super(props);
                this.state = {
                    // Init the state here
                };
            }

            // Implement other methods here

            render(): JSX.Element {
                // Render all your added markup
                return (
                        <CSSTransition
                            in={this.props.match !== null}
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
                            <Component  {...this.props} />
                        </CSSTransition>
                );
            }
        };

        return result;
    };

export default yourHocFactoryName