import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'rebass/styled-components'
import { FormattedMessage, useIntl } from 'react-intl'
import { Dialog, Heading, Button, DialogOverlay, Message } from 'components/UI'
import { PasswordInput, Form } from 'components/Form'
import messages from './messages'

const DialogWrapper = ({ loginError, clearLoginError, isOpen, onOk, onCancel, isPromptMode }) => {
  const intl = useIntl()
  const formApiRef = useRef(null)
  useEffect(() => {
    const { current: formApi } = formApiRef
    if (loginError && formApi) {
      formApi.setFormError(loginError)
      clearLoginError()
    }
  }, [loginError, clearLoginError])

  if (!isOpen) {
    return null
  }

  const headerMessage = isPromptMode
    ? messages.password_prompt_dialog_header
    : messages.password_set_dialog_header

  const inputDesc = isPromptMode
    ? messages.password_prompt_dialog_description
    : messages.password_set_dialog_description

  const buttons = (
    <>
      <Button type="submit" variant="primary">
        <FormattedMessage {...messages.password_prompt_dialog_ok_button_text} />
      </Button>
      <Button onClick={onCancel} type="button" variant="secondary">
        <FormattedMessage {...messages.password_dialog_cancel_button_text} />
      </Button>
    </>
  )

  const header = (
    <Flex alignItems="center" flexDirection="column" mb={4}>
      <Heading.h1>
        <FormattedMessage {...headerMessage} />
      </Heading.h1>
    </Flex>
  )

  const handleSubmit = values => onOk(values)

  return (
    <DialogOverlay alignItems="center" justifyContent="center" position="fixed">
      <Form getApi={api => (formApiRef.current = api)} onSubmit={handleSubmit}>
        {({ formState: { submits, error } }) => {
          const willValidateInline = submits > 0
          return (
            <Dialog buttons={buttons} header={header} onClose={onCancel} width={640}>
              {error && (
                <Message mb={3} variant="error">
                  {error}
                </Message>
              )}
              <Flex alignItems="center" flexDirection="column" width={350}>
                <PasswordInput
                  description={intl.formatMessage(inputDesc)}
                  field="password"
                  hasMessageSpacer
                  isRequired
                  minLength={6}
                  validateOnBlur={willValidateInline}
                  validateOnChange={willValidateInline}
                  width={1}
                  willAutoFocus
                />
              </Flex>
            </Dialog>
          )
        }}
      </Form>
    </DialogOverlay>
  )
}

DialogWrapper.defaultProps = {
  isPromptMode: true,
}

DialogWrapper.propTypes = {
  clearLoginError: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isPromptMode: PropTypes.bool,
  isRestoreMode: PropTypes.bool,
  loginError: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
}

export default DialogWrapper
