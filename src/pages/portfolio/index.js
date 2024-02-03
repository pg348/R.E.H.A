import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { dataportfolio, meta } from "../../content_option";

export const Portfolio = () => {
  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title> Tutorial {meta.title} </title>{" "}
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4"> Tutorial </h1>{" "}
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>
        <div className="mb-5 po_items_ho" style={{ display: 'flex', justifyContent: 'center' }}>
          {dataportfolio.map((data, i) => {
            return (
              <div key={i} className="po_item video-holder">
                <div style={{ width: '850px', height: '450px' }}>
                  <iframe width="830" height="390" 
                  src="https://www.youtube.com/embed/EVF_AuhJgLg" 
                  title="Test" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; 
                  clipboard-write; 
                  encrypted-media; gyroscope; 
                  picture-in-picture; web-share" 
                  allowfullscreen>
                  </iframe>
                  {/* <video src={data.video} controls>
                    Your browser does not support the video tag.
                  </video> */}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </HelmetProvider >
  );
};
