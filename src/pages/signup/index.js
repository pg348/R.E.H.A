import React, { useState } from "react";
import * as emailjs from "emailjs-com";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta } from "../../content_option";
import { Container, Row, Col, Alert, Button, FormControl, InputGroup } from "react-bootstrap";
import { contactConfig } from "../../content_option";
import { Link } from 'react-router-dom';

export const Signup = () => {
  const [formData, setFormdata] = useState({
    name: "",
    email: "",
    loading: false,
    show: false,
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setFormdata({
        ...formData,
        alertmessage: "Passwords do not match",
        variant: "danger",
        show: true,
      });
      return; // Stop the submission if passwords don't match
    }

    setFormdata({ loading: true });

    const templateParams = {
      from_name: formData.email,
      user_name: formData.name,
      to_name: contactConfig.YOUR_EMAIL,
      message: formData.message,
    };

    emailjs
      .send(
        contactConfig.YOUR_SERVICE_ID,
        contactConfig.YOUR_TEMPLATE_ID,
        templateParams,
        contactConfig.YOUR_USER_ID
      )
      .then(
        (result) => {
          console.log(result.text);
          setFormdata({
            loading: false,
            alertmessage: "SUCCESS! ,Thankyou for your messege",
            variant: "success",
            show: true,
          });
        },
        (error) => {
          console.log(error.text);
          setFormdata({
            alertmessage: `Faild to send!,${error.text}`,
            variant: "danger",
            show: true,
          });
          document.getElementsByClassName("co_alert")[0].scrollIntoView();
        }
      );
  };

  const handleChange = (e) => {
    setFormdata({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <HelmetProvider>
      <Container>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} | LoginSignUp</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">Sign Up</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="12">
            <Alert

              variant={formData.variant}
              className={`rounded-0 co_alert ${formData.show ? "d-block" : "d-none"
                }`}
              onClose={() => setFormdata({ show: false })}
              dismissible
            >
              <p className="my-0">{formData.alertmessage}</p>
            </Alert>
          </Col>
          <Col lg="7" className="d-flex align-items-center">
            <form onSubmit={handleSubmit} className="contact__form w-100">
              <Row>
                <Col lg="10" className="form-group">
                  <input
                    className="form-control rounded-0"
                    id="name"
                    name="name"
                    placeholder="Name"
                    type="text"
                    value={formData.name || ""}
                    required
                    onChange={handleChange}
                  />
                </Col>
                <Col lg="10" className="form-group">
                  <input
                    className="form-control rounded-0"
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={formData.email || ""}
                    required
                    onChange={handleChange}
                  />
                </Col>
                <Col lg="10" className="form-group">
                  <input
                    className="form-control rounded-0"
                    id="password"
                    name="password"
                    placeholder="Password"
                    type="password"   //aankh laga diyo password dekhne k liye
                    value={formData.password || ""}
                    required
                    onChange={handleChange}
                  />
                </Col>
                <Col lg="10" className="form-group">
                  <input
                    className="form-control rounded-0"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    type="password"   //aankh laga diyo password dekhne k liye
                    value={formData.confirmPassword || ""}
                    required
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <Row>
                <Col lg="12" className="form-group">
                  <Link to="/main">
                    <button className="btn ac_btn" type="submit">
                      {formData.loading ? "Sending..." : "Sign Up"}
                    </button>
                  </Link>
                  <Link to="/main">
                    <button className="btn ac_btn" type="submit">
                      {formData.loading ? "Sending..." : "Signup using Google"}
                    </button>
                  </Link>
                </Col>
              </Row>
              <p style={{ marginTop: "10px" }}>Already have an account? <Link to="/login" style={{ textDecoration: "underline" }}>Login</Link>
              </p>
            </form>
          </Col>
        </Row>
      </Container>
      <div className={formData.loading ? "loading-bar" : "d-none"}></div>
    </HelmetProvider>
  );
};
