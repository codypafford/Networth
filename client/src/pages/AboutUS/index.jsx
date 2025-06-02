import React from 'react'
import './style.scss'

export default function AboutUs() {
  return (
    <div className="about-us">
      <section className="about-us__section">
        <h1 className="about-us__heading">About This App</h1>
        <p className="about-us__text">
          This app was built for personal use — a simple tool to track specific spending 
          categories like dining, groceries, and other focused areas. It's not about 
          tracking every dollar, just the stuff that matters most to me.
        </p>
      </section>

      <section className="about-us__section">
        <h2 className="about-us__subheading">How It Works</h2>
        <p className="about-us__text">
          You choose what you want to track — say, how much you spend eating out each month 
          or your grocery total over time. Then, you create dashboards for each category. 
          Each dashboard shows stats, trends, and insights to help you stay aware and in control.
        </p>
        <p className="about-us__text">
          It also tracks overall savings, so you can see how your habits affect your bigger picture 
          over time.
        </p>
      </section>

      <section className="about-us__section">
        <h2 className="about-us__subheading">Why I Made It</h2>
        <p className="about-us__text">
          I didn’t want a bloated budgeting app. I just wanted something lightweight and 
          customized to track the categories I care about. This app helps me stay focused, 
          spot trends, and make better spending decisions without overcomplicating anything.
        </p>
      </section>
    </div>
  )
}
