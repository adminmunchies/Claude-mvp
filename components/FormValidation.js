import { useState } from 'react'

export default function FormValidation({ children, onSubmit, validationRules = {} }) {
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = (name, value) => {
    const rules = validationRules[name]
    if (!rules) return null

    if (rules.required && (!value || value.trim() === '')) {
      return `${rules.label || name} is required`
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `${rules.label || name} must be at least ${rules.minLength} characters`
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `${rules.label || name} must be less than ${rules.maxLength} characters`
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.patternMessage || `${rules.label || name} format is invalid`
    }

    if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address'
    }

    return null
  }

  const validateAllFields = (formData) => {
    const newErrors = {}
    let hasErrors = false

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName])
      if (error) {
        newErrors[fieldName] = error
        hasErrors = true
      }
    })

    return { errors: newErrors, hasErrors }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData.entries())

    const { errors: newErrors, hasErrors } = validateAllFields(data)
    setErrors(newErrors)

    if (!hasErrors) {
      try {
        await onSubmit(data)
      } catch (error) {
        setErrors({ submit: error.message || 'An error occurred. Please try again.' })
      }
    }

    setIsSubmitting(false)
  }

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    
    setErrors(prev => ({
      ...prev,
      [name]: error,
      submit: null // Clear submit error when user makes changes
    }))
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {children({ 
        errors, 
        isSubmitting, 
        handleFieldChange,
        getFieldProps: (name) => ({
          name,
          onChange: handleFieldChange,
          style: {
            borderColor: errors[name] ? '#dc2626' : '#d1d5db'
          }
        })
      })}
    </form>
  )
}

export const ErrorMessage = ({ error }) => {
  if (!error) return null
  
  return (
    <div style={{
      color: '#dc2626',
      fontSize: '0.875rem',
      marginTop: '5px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <span style={{ marginRight: '5px' }}>⚠️</span>
      {error}
    </div>
  )
}
