import React from "react";
import './SaleSearch.css'
import SaleService from "../../services/SaleService";
import SaleItem from "../sale-item/SaleItem";
import { USER_SESSION_KEY, checkIfUserHasSignIn, currentUser } from "../../services/Util";
import Tags from "../tags/Tags";
import { thisTypeAnnotation } from "@babel/types";

const service = new SaleService();
const initialState = () => {
    const user = currentUser();
    if (user.tag !== null) {
        console.log(user.tag)
        return {
            search: {
                tag: user.tag
            },
            tag: user.tag
        }
    } else {
        return {
            search: {}
        }
    }
}

export default class SaleSearch extends React.Component {
    constructor(props) {
        super(props);

        // 3. Comprobar que el usuario se ha registrado [LISTO]
        checkIfUserHasSignIn(this.props.history);

        // 3. Si el usuario especificó un tag en el registro, se debe añadir por defecto a la búsqueda [LISTO]
        this.state = initialState();

        this.search();

        this.handleSearch = this.handleSearch.bind(this);
        this.search = this.search.bind(this);

        // Retrieve the tags needed to filter sales
        // 1. Este servicio como el <select> que hay en el render se pueden sustituir por el componente <Tags> [LISTO]
        // 1. Para más información de como se usa ver el componente SignIn [LISTO]
    }

    search() {
        // 2. Llamar al servicio service.getSales(this.state.search), gestionar su petición y añadir al estado su resultado [LISTO]

        const tag = this.state.tag ? this.state.tag : "";
        const price = this.state.price ? this.state.price : "";
        const name = this.state.name ? this.state.name : "";

        service.getSales({tag, price, name}).then((res) => {
            if (res.success) {
                this.setState({
                    sales: res.result
                })
            }
        });
    }

    handleSearch(event) {
        const {name, value} = event.target;

        this.setState({
            search: {
                [name]: value.trim().length ? value.trim() : null
            },
            [name]: value
        }, () => {
            this.search();
        });

    }

    render() {
        return (
            <div className={`sale-search container`}>
                <div className="row mb-3">
                    <input name="name" onChange={this.handleSearch} className={`form-control col-2 ml-4`} placeholder={`Filter by name`}/>
                    <input name="price" type="number" onChange={this.handleSearch} className={`form-control col-1 ml-4`} placeholder={`Price`}/>
                    <Tags name="tag" value={this.state.search.tag} onTagChange={this.handleSearch} firstOptionName="Filter by tag"  className={`form-control col-2 ml-4`}/>
                </div>

                {
                    ((this.state.sales && !this.state.sales.length) || !this.state.sales)
                    &&
                    <div className="text-center">
                        <h2>No se han encontrado elementos</h2>
                    </div>
                }
                {
                    this.state.sales
                    &&
                    (
                        <div className="row">
                            {
                                this.state.sales.map((sale, index) => {
                                    return (
                                        <div key={sale._id} className="col-4" onClick={() => this.props.history.push(`sale/${sale._id}`)}>
                                            <SaleItem item={sale}/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }
            </div>
        );
    }
}
