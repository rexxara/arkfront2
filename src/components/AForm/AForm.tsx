import React from 'react';
import './style.css'
interface IProps {
    onSubmit: (values: Object[]) => any,
    button?: boolean
}
class AForm extends React.Component<IProps>{
    render() {
        const { onSubmit, button, ...otherProps } = this.props
        console.log(button)
        const warpeedSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
            event.preventDefault()
            const inputs = event.target.getElementsByTagName("input")
            const hasInvalid = Array.prototype.some.call(inputs, (v, k) => {
                return !(v.getAttribute("data-valided") === "true")
            })
            let values: Object[] = []
            Array.prototype.map.call(inputs, (v, k) => {
                const key = v.getAttribute("data-key")
                if (key) {
                    values.push({
                        [key]: v.value
                    })
                }

            })
            if (!hasInvalid) { onSubmit(values) } else { alert("inValid") }
        }
        return (
            <form onSubmit={warpeedSubmit} {...otherProps} >
                <p>InTheForm</p>
                {this.props.children}
                {button && <input data-valided="true" type="submit" value="submit" />}
            </form>
        )
    }

}




export default AForm
