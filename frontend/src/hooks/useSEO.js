import { useEffect } from "react";

const useSEO = ({ title, description, canonical, ogImage, ogUrl }) => {
  useEffect(() => {
    // Title
    if (title) document.title = title;

    // Meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      metaDescription.content = description;
      document.head.appendChild(metaDescription);
    }

    // Canonical
    if (canonical) {
      let link = document.querySelector("link[rel='canonical']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    // Open Graph
    const setOG = (property, content) => {
      let tag = document.querySelector(`meta[property='${property}']`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    if (ogUrl) setOG("og:url", ogUrl);
    if (title) setOG("og:title", title);
    if (description) setOG("og:description", description);
    if (ogImage) setOG("og:image", ogImage);

    // Twitter Card
    const setTwitter = (name, content) => {
      let tag = document.querySelector(`meta[name='${name}']`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    };
    setTwitter("twitter:card", "summary_large_image");
    setTwitter("twitter:title", title || "");
    setTwitter("twitter:description", description || "");
    setTwitter("twitter:image", ogImage || "");
  }, [title, description, canonical, ogImage, ogUrl]);
};

export default useSEO;
