export const getSummaryHtml = (summary) => (
  <div className="summary-html">
    <h4 className="summary-html__header">{summary.header}</h4>
    {summary.items.map((item, index) => (
      <p key={index} className="summary-html__item">
        {item}
      </p>
    ))}
  </div>
);
