import React, { useState } from 'react'
import './style.scss'

export default function AboutUs() {
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Feedback submitted:', feedback)
    setSubmitted(true)
    setFeedback('')
  }

  return (
    <div className='about-us'>
      <section className='about-us__section'>
        <h1 className='about-us__heading'>About Us</h1>
        <p className='about-us__text'>
          We are a financial wellness platform dedicated to helping individuals
          understand and manage their money better. Our goal is to provide
          tools, insights, and support to empower our users on their financial
          journey.
        </p>
      </section>

      <section className='about-us__section'>
        <h2 className='about-us__subheading'>Our Mission</h2>
        <p className='about-us__text'>
          Our mission is to help you take control of your finances by making it
          easy to understand where your money is going and whether you're
          staying on track with your financial goals. We believe that good
          financial decisions start with clarity—and that starts with tracking.
          We help you monitor your spending trends over time, compare
          current spending against your historical averages, and gain insights
          into specific categories you care about—like groceries, dining,
          subscriptions, and more. Whether you're trying to cut back, stay
          consistent, or just build awareness, our goal is to give you a clear,
          simple view of your financial habits so you can make smarter choices
          and feel confident about your money.
        </p>
      </section>

      <section className='about-us__section'>
        <h2 className='about-us__subheading'>Feedback</h2>
        <form className='about-us__form' onSubmit={handleSubmit}>
          <textarea
            className='about-us__textarea'
            placeholder='Leave your comments or concerns...'
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
          <button className='about-us__button' type='submit'>
            Submit
          </button>
          {submitted && (
            <p className='about-us__confirmation'>Thanks for your feedback!</p>
          )}
        </form>
      </section>
    </div>
  )
}
