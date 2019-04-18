import React, { Component } from 'react'

const validateEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

const validators = {
  required: value => !value 
    ? 'Required' 
    : undefined,
  email: value => value && !validateEmail(value) 
    ? 'Invalid email'
     : undefined,
}

const validateFieldValue = (rules, value) =>
  rules.reduce((fieldError, rule) => {
    const err = validators[rule](value)
    if (err) {
      fieldError.push(err)
    }
    return fieldError
  }, [])

const validateFormValues = (validations, values) => {
  const errors = {}
  Object.keys(values).forEach(name => {
    if (validations[name]) {
      const value = values[name]
      const rules = validations[name]
      const fieldError = validateFieldValue(rules, value)
      if (fieldError && fieldError.length > 0) {
        errors[name] = fieldError
      }
    }
  })
  return errors
}

class Formidable extends Component {
  state = {
    errors: {},
    values: this.props.initialValues
      ? this.props.initialValues
      : {},
    submitting: false,
    submitted: false,
    valid: false,
    successMessage: '',
    submissionError: '',
  }

  setValue = event => {
    const name = event.target.name
    const value = event.target.value
    
    if (this.props.validations && this.props.validations[name]) {
      const rules = this.props.validations[name]
      const fieldError = validateFieldValue(rules, value)
      if (fieldError && fieldError.length > 0) {
        this.setState(state => ({
          errors: {
            ...state.errors,
            [name]: fieldError,
          },
          valid: false,
        }))
      } else if (this.state.errors[name]) {
        const { [name]: removedError, ...restErrors } = this.state.errors
        const newState = {
          errors: restErrors, 
        }
        if (Object.keys(restErrors).length === 0) {
          newState.valid = true
        }
        this.setState(newState)
      }
    }

    this.setState(state => ({
      values: {
        ...state.values,
        [name]: value,
      }
    }))
  }

  getFirstError = fieldName =>
    (Array.isArray(this.state.errors[fieldName]) 
      && this.state.errors[fieldName].length > 0)
        ? this.state.errors[fieldName][0]
        : null

  submit = event => {
    if (event) {
      event.preventDefault()
    }

    this.setState({ submitted: true })

    if(this.props.validations) {
      const errors = validateFormValues(this.props.validations, this.state.values)
      if (Object.keys(errors).length > 0) {
        this.setState({
          errors,
          valid: false,
        })
        return
      }
    }

    this.setState({
      submitting: true,
      valid: true,
    })

    if (this.props.submitHandler) {
      this.props.submitHandler({
        values: this.state.values,
        setSuccessMessage: successMessage => {
          this.setState({ 
            submissionError: '',
            successMessage,
          })
        },
        setSubmissionError: submissionError => {
          this.setState({
            submissionError,
            successMessage: '',
          })
        },
        setValid: valid => {
          this.setState({ valid })
        },
        setSubmitting: submitting => {
          this.setState({ submitting })
        },
        setValues: values => {
          this.setState(prevState => ({
            values: {
              ...prevState.values,
              ...values,
            }
          }))
        }
      })
    }
  }

  render() {
    return (
      this.props.children({
        ...this.state,
        setValue: this.setValue,
        submit: this.submit,
        getFirstError: this.getFirstError,
      })
    )
  }
}

export default Formidable