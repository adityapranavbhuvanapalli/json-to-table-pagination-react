import React, {Component} from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import './App.css'

export default class App extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            id : 0,
            offset: 0,
            data: [],
            perPage: 50,
            currentPage: 0
        };
        this.handlePageClick = this
            .handlePageClick
            .bind(this);
    }
    
    receivedData() {
        axios.get("https://gist.githubusercontent.com/tdreyno/4278655/raw/7b0762c09b519f40397e4c3e100b097d861f5588/airports.json")
            .then(res => {
              const data = res.data;
              const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
              const postData = slice.map(item => <React.Fragment>
                  <tr key={item.code}>
                    <td>{++this.state.id}</td>
                    <td>{item.code}</td>
                    <td>{item.name?item.name:"Aditya Pranav Bhuvanapalli"}</td>
                    <td>{item.city}</td>
                    <td>{item.country}</td>
                  </tr>
                </React.Fragment>)

              this.setState({
                  pageCount: Math.ceil(data.length / this.state.perPage),                  
                  postData
              })
            });
    }
    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            id: offset,
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.receivedData()
        });

    };

    componentDidMount() {
        this.receivedData();
    }
    render() {
        return (
            <div align="center">
              <h2>JSON into Table With Pagination</h2>
              <table align="center" cellPadding='6' cellSpacing='0'>
                <thead> 
                  <td>Sl. No. &nbsp;</td>
                  <td>Code</td>
                  <td>Name</td>
                  <td>City</td>
                  <td>Country</td>
                </thead>
                <tbody>
                  {this.state.postData}
                  <ReactPaginate
                      // previousLabel={"<-"}
                      // nextLabel={"->"}
                      // breakLabel={"..."}
                      // breakClassName={"break-me"}
                      pageCount={this.state.pageCount}
                      // marginPagesDisplayed={2}
                      // pageRangeDisplayed={5}
                      onPageChange={this.handlePageClick}
                      containerClassName={"pagination"}
                      subContainerClassName={"pages pagination"}
                      activeClassName={"active"}
                  />
                </tbody>
              </table>
            </div>

        )
    }
}
