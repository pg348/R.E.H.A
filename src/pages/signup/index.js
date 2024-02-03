import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta } from "../../content_option";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { Link } from 'react-router-dom';

import { contactConfig } from "../../content_option";

const supabase = createClient(
  "https://nkotlqqoqgudqbsjygmn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rb3RscXFvcWd1ZHFic2p5Z21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY3ODg4MjQsImV4cCI6MjAyMjM2NDgyNH0.M4PpTHMpIDkE8tSl3s1VirL5vI6H6UrYWx53alfIorQ"
);

export const Signup = () => {
  const [formData, setFormdata] = useState({
    name: "",
    email: "",
    loading: false,
    show: false,
    password: "",
    confirmPassword: "",
  });

  const handleSupabaseSignUp = async () => {
    try {
      const { user, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setFormdata({
          ...formData,
          alertmessage: error.message,
          variant: "danger",
          show: true,
        });
      } else {
        setFormdata({
          ...formData,
          alertmessage: "Sign up successful. Confirmation mail is sent. Click on it.",
          variant: "success",
          show: true,
        });
      }
    } catch (error) {
      console.error("Error signing up with Supabase:", error.message);
    }
  };




  const handleGoogleSignIn = async () => {
    try {
      const { user, session, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        alert(error.message);
      } else {
        alert("Google sign up successful");
        window.location.href = "./main";
        // Redirect or perform other actions after successful sign-up with Google
      }
    } catch (error) {
      console.error("Error signing up with Google:", error.message);
    }

  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setFormdata({
        ...formData,
        alertmessage: "Passwords do not match",
        variant: "danger",
        show: true,
      });
      return;
    }

    setFormdata({ ...formData, loading: true });

    // No email.js functionality

    // After sending email, sign up with Supabase
    handleSupabaseSignUp();
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
                    type="password"
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
                    type="password"
                    value={formData.confirmPassword || ""}
                    required
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <Row>
                <Col lg="12" className="form-group">
                  <button className="btn ac_btn" type="submit">
                    {formData.loading ? "Sending..." : "Sign Up"}
                  </button>
                  <button className="btn ac_btn" type="button" onClick={handleGoogleSignIn}>
                    {formData.loading ? "Sending..." : "Signup using Google"}
                  </button>
                </Col>
              </Row>
              <p style={{ marginTop: "10px" }}>
                Already have an account? <Link to="/login" style={{ textDecoration: "underline" }}>Login</Link>
              </p>
            </form>
          </Col>
        </Row>
      </Container>
      <div className={formData.loading ? "loading-bar" : "d-none"}></div>
    </HelmetProvider>
  );
};
