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
            currentPage: 0,
            sortKey : "code",
            ascSort : 1
        };
        this.handlePageClick = this
            .handlePageClick
            .bind(this);
    }
    
    receivedData(sortKey) {
        axios.get("https://gist.githubusercontent.com/tdreyno/4278655/raw/7b0762c09b519f40397e4c3e100b097d861f5588/airports.json")
            .then(res => {
              const data = res.data;
              if(this.state.ascSort===1){ 
                data.sort((a,b) => a[sortKey].localeCompare(b[sortKey])) 
              }
              else{ 
                data.sort((b,a) => a[sortKey].localeCompare(b[sortKey]))
              }
              const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
              const postData = slice.map(item => <React.Fragment>
                  <tr key={item.code}>
                    {/* <td>{++this.state.id}</td> */}
                    <td>{item.code?item.code:"###"}</td>
                    <td>{item.name?item.name:"### airport"}</td>
                    <td>{item.city?item.city:"### city"}</td>
                    <td>{item.country?item.country:"### country"}</td>
                  </tr>
                </React.Fragment>)

              this.setState({
                  pageCount: Math.ceil(data.length / this.state.perPage),                  
                  data : res.data,
                  sortKey : sortKey,
                  postData
              })              
            })
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            id: offset,
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.receivedData(this.state.sortKey)
        });
    };

    componentDidMount() {
        this.receivedData(this.state.sortKey);
    }
    
    render() {
        return (
            <div align="center">
              <h2>JSON into Table With Pagination and Sort</h2>
              <table align="center" cellPadding='6' cellSpacing='0'>
                <thead> 
                  <tr>
                    <td onClick={() => this.receivedData('code')}>Code</td>
                    <td onClick={() => this.receivedData('name')}>Name</td>
                    <td onClick={() => this.receivedData('city')}>City</td>
                    <td onClick={() => this.receivedData('country')}>Country</td>
                  </tr>
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
