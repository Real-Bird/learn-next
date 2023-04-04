/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import ArticleCard from "../index";
import { cutTextToLength } from "../../../utils";
import { article } from "../tests/mock";

describe("ArticleCard", () => {
  test("Generated link should be in the correct format", () => {
    const component = render(<ArticleCard {...article} />);
    const link = component.getByRole("link").getAttribute("href");
    expect(link).toBe("/articles/healthy-summer-meloncarrot-soup-u12w3o0d");
  });

  test("Generated summary should not exceed 100 characters", async () => {
    render(<ArticleCard {...article} />);
    const summary = screen.getByText(cutTextToLength(article.body, 100));

    expect(summary).toBeDefined();
  });
});
