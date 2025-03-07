import React from 'react';
import Router from 'next/router';
import styled from 'styled-components';

import { responsive, H3 } from 'ui';
import StripeCheckout from './stripe';
import KlarnaCheckout from './klarna';

import {
  Form,
  Input,
  InputGroup,
  Label,
  PaymentSelector,
  PaymentMethods,
  PaymentButton,
  PaymentMethod
} from './styles';

const Outer = styled.div`
  width: 50%;
  padding-right: 50px;
  border-right: 1px solid #dfdfdf;

  ${responsive.xs} {
    width: 100%;
  }
`;
const Row = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border-radius: 0.2rem;
`;
const SectionHeader = styled(H3)`
  font-size: 14px;
  font-weight: 600;
`;
class PaymentGateway extends React.Component {
  state = {
    paymentMethod: null,
    firstName: '',
    lastName: '',
    email: ''
  };

  render() {
    const { items, currency } = this.props;
    const { paymentMethod, firstName, lastName, email } = this.state;

    const personalDetails = {
      firstName,
      lastName,
      email
    };

    return (
      <Outer>
        <Inner>
          <Form noValidate>
            <SectionHeader />
            <Row>
              <InputGroup>
                <Label for="firstname"> First Name</Label>
                <Input
                  name="firstname"
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={e => this.setState({ firstName: e.target.value })}
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label for="lastname"> Last Name</Label>
                <Input
                  name="lastname"
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={e => this.setState({ lastName: e.target.value })}
                  required
                />
              </InputGroup>
            </Row>
            <Row>
              <InputGroup>
                <Label for="email"> Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => this.setState({ email: e.target.value })}
                  required
                />
              </InputGroup>
            </Row>

            <SectionHeader>Choose payment method</SectionHeader>
            <PaymentMethods>
              <PaymentSelector>
                <PaymentButton
                  color="#6773E6"
                  type="button"
                  active={paymentMethod === 'stripe'}
                  onClick={() => this.setState({ paymentMethod: 'stripe' })}
                >
                  <img src="/static/stripe-logo.png" alt="stripe logo" />
                </PaymentButton>
                <PaymentButton
                  color="#F8AEC2"
                  type="button"
                  active={paymentMethod === 'klarna'}
                  onClick={() => this.setState({ paymentMethod: 'klarna' })}
                >
                  <img src="/static/klarna-logo.png" alt="Klarna logo" />
                </PaymentButton>
              </PaymentSelector>
              {paymentMethod === 'stripe' && (
                <PaymentMethod>
                  <StripeCheckout
                    personalDetails={personalDetails}
                    items={items}
                    currency={currency}
                    onSuccess={orderId =>
                      Router.push(`/confirmation/${orderId}`)
                    }
                  />
                </PaymentMethod>
              )}

              {paymentMethod === 'klarna' && (
                <PaymentMethod>
                  <KlarnaCheckout
                    personalDetails={personalDetails}
                    items={items}
                    currency={currency}
                  />
                </PaymentMethod>
              )}
            </PaymentMethods>
          </Form>
        </Inner>
      </Outer>
    );
  }
}

export default PaymentGateway;
