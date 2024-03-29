import React from "react";
import './SignIn.css';
import Tags from "../tags/Tags";
import {USER_SESSION_KEY, signedIn, isOldThan18YearsOld, checkIfUserHasSignIn} from "../../services/Util";
import {withRouter} from "react-router-dom";
import { sign } from "crypto";

class SignIn extends React.Component {
    constructor(props) {
        super(props);

        // 3. Comprobar si ya ha iniciado sesión, si es así redirigir a /home [LISTO]
        if (signedIn()) {
            this.props.history.replace("/home");
        }

        this.state = {
            name: "",
            surname: "",
            birthday: ""
        };

        this.handleTyping = this.handleTyping.bind(this);
        this.handleSignIn = this.handleSignIn.bind(this);
    }

    handleTyping(event) {
        const {name, value} = event.target;

        this.setState({
            [name]: value
        });
    }

    handleSignIn(e) {
        e.preventDefault();

        const {name, surname, birthday, tag} = this.state;

        // 3. Realizar las validaciones de name, surname y birthday. Debe ser mayor de 18 años [LISTO]

        if (name.trim() === "" || surname.trim() === "") {
            alert("The name and surname cannot be empty")
        } else {
            if (!isOldThan18YearsOld(birthday)) {
                alert("You have to be over 18 years old");
            } else {
                sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify({
                    name: name.trim(),
                    surname: surname.trim(),
                    birthday,
                    tag: tag && tag.trim().length ? tag.trim() : null
                }));
        
                this.props.history.push("/home/search")
            }
        }

    }

    render() {
        return (
            <div className={`contact-us container`}>
                <h2>Welcome to Wallakeep!</h2>
                <h4>Please sign up to continue</h4>

                <form className="row mt-4" onSubmit={this.handleSignIn}>
                    <div className="col-4">
                        <input type="text" name="name" value={this.state.name} className={`form-control`} onChange={this.handleTyping} placeholder="Name"/>
                    </div>
                    <div className="col-4">
                        <input type="text" name="surname" value={this.state.surname} className={`form-control`} onChange={this.handleTyping} placeholder="Surname"/>
                    </div>
                    <div className="col-4">
                        <input type="date" name="birthday" value={this.state.birthday} className={`form-control`} onChange={this.handleTyping} placeholder="Birthday"/>
                    </div>
                    <div className="col-4 mt-4">
                        <Tags name="tag" onTagChange={this.handleTyping} firstOptionName="Favourite tag" class="form-control"/>
                    </div>

                    <div className="col-12 mt-4">
                        <button className="btn-primary btn">Sign in</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default withRouter(SignIn);
