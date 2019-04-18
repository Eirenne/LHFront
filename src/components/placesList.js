import React, { Component } from 'react'
import axios from 'axios'
import { Button, Table, Input, Header, Container, Segment, Icon } from 'semantic-ui-react'


class Places extends Component {
    state = {
        places: [],
        loadingPlaces: false,
        query: '',
        bookingPlace: null,
    }

    delayId = null

    clearTimeoutId = (delayId) => {
        clearTimeout(delayId)
    }

    componentDidMount() {
        this.fetchPlaces()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.query !== this.state.query) {
            if (this.delayId) {
                this.clearTimeoutId(this.delayId)
            }
            this.delayId = setTimeout(() => {
                this.fetchPlaces()
            }, 500)
        }
    }

    componentWillUnmount() {
        if (this.delayId) {
            this.clearTimeoutId(this.delayId)
        }
    }

    getCurrentPosition = () => {
        const {
            enableHighAccuracy,
            timeout,
            maximumAge
        } = this.props

        this.setState({ fetchingPosition: true })
        return window.navigator.geolocation.getCurrentPosition(
            location => {
                if (this.willUnmount) return

                this.setState({ location, fetchingPosition: false })

            },
            error => {
                if (this.willUnmount) return

                this.setState({ errorPosition: error, fetchingPosition: false })
            },
            { enableHighAccuracy, timeout, maximumAge }
        )
    }

    fetchPlaces() {
        this.setState({
            loadingProducts: true,
        })
        axios.get('http://localhost:8001/api/v1/places', {
            withCredentials: true,
            params: {
                location: '52.5304417,13.4111201',
                query: this.state.query
            },
        })
            .then(res => {
                this.setState({
                    loadingPlaces: false,
                    places: res.data.items || res.data,
                })
            })
            .catch(err => {
                this.setState({
                    loadingProducts: false,
                    productsFetchingError: 'Oops! Something goes wrong'
                })
            })
    }

    handleClick = (e, place) => {
        this.setState({
            bookingPlace: place.id,
            success: false
        })
        axios.post('http://localhost:8001/api/v1/bookings',
            {
                property_id: place.id,
                property_name: place.name
            }, {

                withCredentials: true
            })
            .then(res => {
                setTimeout(() => {
                    this.setState({
                        bookingPlace: null,
                        success: true
                    })
                }, 500)

            })
            .catch(err => {
                setTimeout(() => {
                    this.setState({
                        bookingPlace: null,
                    })
                }, 1000)
            })
    }

    onQueryChange = e => {
        this.setState({
            query: e.target.value,
        })
    }

    render() {
    

        if (!this.state.location) {
            return (
                <Segment placeholder style ={{marginTop:'100px'}}>
                    <Header icon>
                        <Icon name='search' />
                        Please enable location to use our search system
                    </Header>
                    <Segment.Inline>
                        <Button primary onClick={e => this.getCurrentPosition()}>Enable</Button>
                    </Segment.Inline>
                </Segment>
            )
        }
        return (
            <Container>
                <style>{`
            body > div,
            body > div > div,
            body > div > div > div.login-form {
                height: 100%;
            }
            `}
                </style>
                <Header as='h1' textAlign='center'>
                    Nearby Places
                </Header>
                <Input fluid placeholder='Search Places...' value={this.state.query}
                    onChange={this.onQueryChange} />
                {this.state.success &&
                    <div class="ui positive message">
                        <div class="header">
                            Successfully Booked
                    </div>
                    </div>
                }

                {this.state.error &&
                    <div class="ui negative message">
                        <div class="header">
                            Couldn't book place
                    </div>
                    </div>
                }

                <Table color={'blue'} key={'blue'}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Category</Table.HeaderCell>
                            <Table.HeaderCell>Distance</Table.HeaderCell>
                            <Table.HeaderCell>Book</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    {this.state.places &&
                        <Table.Body>
                            {this.state.places.map((place, i) => (
                                <Table.Row key={place.id}>
                                    <Table.Cell>{place.title}</Table.Cell>
                                    <Table.Cell>{(place.category && place.category.title) || place.category || place.categoryTitle || 'No category'}</Table.Cell>
                                    <Table.Cell>{place.distance || 'Not provided'}</Table.Cell>
                                    <Table.Cell><Button
                                        color='blue' disabled={this.state.bookingPlace !== null && this.state.bookingPlace !== place.id}
                                        loading={this.state.bookingPlace === place.id}
                                        onClick={e => this.handleClick(e, place)}>Book</Button></Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    }

                </Table>
            </Container>

            // <Fragment>
            //     
            //     {/* <Search
            //         value={this.state.term}
            //         onChange={this.onTermChange}
            //     />
            //     <CatalogueList
            //         loadingItems={this.state.loadingProducts}
            //         items={this.state.products}
            //         fetchingError={this.state.productsFetchingError}
            //         addToCart={addToCart}
            //         term={this.state.term}
            //     /> */}
            // </Fragment>
        )
    }
}

export default Places