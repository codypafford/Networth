export const getSummaryHtml = (summary) => (
  <div>
    <h4>{summary.header}</h4>
    {summary.items.map((item, index) => (
      <p key={index}>{item}</p>
    ))}
  </div>
);
