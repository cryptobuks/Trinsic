import React, { Component } from 'react'
import compose from 'recompose/compose'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { putUser, fetchNegotiationsThunk, me } from '../store'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import Input from '@material-ui/core/Input'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import CardMedia from '@material-ui/core/CardMedia'
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';

const styles = theme => ({
  card: {
    maxWidth: 375,
    margin: 'auto'
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: theme.spacing.unit
  },
  textField: {
    flexBasis: 200,
    margin: theme.spacing.unit
  },
  media: {
    // backgroundSize: `contain`,
    paddingTop: '70%' // 16:9
  }
})

class UserHome extends Component {
  constructor(props) {
    super(props)
    let user = this.props.user
    this.state = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      streetAddress: user.streetAddress,
      city: user.city,
      state: user.state,
      biography: user.biography,
      imageUrl: user.imageUrl,
      triggered: false,
      redirect: false,
      skills: user.skills,
      open: false,
    }
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount(){
    this.props.fetchAllChatRooms()
    this.props.fetchUser()
  }

  handleChange(evt) {
    this.setState({[evt.target.name]: evt.target.value, triggered: true})
    console.log(this.state.firstName)
  }

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const {handleSubmit, error, classes} = this.props
    let {
      firstName,
      lastName,
      email,
      streetAddress,
      city,
      state,
      biography,
      imageUrl,
      skills
    } = this.state

    const onEditPage = () => this.props.match.path.includes("edit");
    const notOnEditPage = !onEditPage();
    console.log(skills)
    return (
      <div>
      <div className="cards">
        <Card className={classes.card}>
          <CardMedia className={classes.media} image={imageUrl} title="User" />
          <CardContent>
            <form onSubmit={evt => handleSubmit(evt, this.state)} name={name}>
              <div>
                <FormControl className={classes.textField}>
                  <InputLabel
                    className="inputLabel"
                    htmlFor="adornment-firstName"
                  >
                    First Name
                  </InputLabel>
                  <Input
                    value={firstName}
                    name="firstName"
                    type="text"
                    onChange={this.handleChange}
                    disabled={notOnEditPage}
                  />
                </FormControl>
                <FormControl className={classes.textField}>
                  <InputLabel
                    className="inputLabel"
                    htmlFor="adornment-lastName"
                  >
                    Last Name
                  </InputLabel>
                  <Input
                    value={lastName}
                    name="lastName"
                    type="text"
                    onChange={this.handleChange}
                    disabled={notOnEditPage}
                  />
                </FormControl>
                <FormControl>
                  <InputLabel className="inputLabel" htmlFor="adornment-email">
                    Email
                  </InputLabel>
                  <Input
                    value={email}
                    name="email"
                    type="text"
                    onChange={this.handleChange}
                    disabled={notOnEditPage}
                  />
                </FormControl>
                <FormControl>
                  <InputLabel className="inputLabel" htmlFor="adornment-email">
                    City
                  </InputLabel>
                  <Input
                    value={city}
                    name="city"
                    type="text"
                    onChange={this.handleChange}
                    disabled={notOnEditPage}
                  />
                </FormControl>
                <FormControl>
                  <InputLabel className="inputLabel" htmlFor="adornment-email">
                    State
                  </InputLabel>
                  <Input
                    value={state}
                    name="state"
                    type="text"
                    onChange={this.handleChange}
                    disabled={notOnEditPage}
                  />
                </FormControl>
                <FormControl>
                  <InputLabel className="inputLabel" htmlFor="adornment-email">
                    Biography
                  </InputLabel>
                  <Input
                    value={biography}
                    name="biography"
                    type="text"
                    onChange={this.handleChange}
                    disabled={notOnEditPage}
                  />
                </FormControl>
                {/* <FormControl>
                  <InputLabel className="inputLabel" htmlFor="adornment-biography">
                    Skill
                  </InputLabel>
                  <Input
                    value={skills[0].name}
                    name="skills"
                    type="text"
                    onChange={this.handleChange}
                    disabled={notOnEditPage}
                  />
                </FormControl> */}
              </div>
              <div>
                <CardActions>
                  { this.props.match.path.includes("edit")
                    ? <Button type="submit" onClick={this.handleClick}>Update Your Information</Button>
                    : <Link to={`/users/${this.state.id}/edit`}><Button>Click To Edit</Button></Link>
                  }
                </CardActions>
              </div>
              {error && error.response && <div> {error.response.data} </div>}
            </form>
          </CardContent>
        </Card>
        <Snackbar
          open={this.state.open}
          onClose={this.handleClose}
          TransitionComponent={Fade}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Your edits have been saved!</span>}
        />
      </div>
      </div>
    )
  }
}

//access store's state with this.props.state, access local state with just this.state
const mapStateToProps = state => {
  return {
    user: state.user,
    displayName: '',
    error: state.user.error
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchUser: () => dispatch(me()),
    handleSubmit: async (evt, user) => {
      evt.preventDefault()
      await dispatch(putUser(user, user.id))
      await dispatch(me())
      ownProps.history.push("/home")
    },
    fetchAllChatRooms: () => dispatch(fetchNegotiationsThunk())
  }
}

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default compose(
  withStyles(styles, {
    name: 'UserHome'
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(UserHome)
