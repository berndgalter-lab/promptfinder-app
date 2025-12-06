interface BreadcrumbSchemaProps {
  workflowTitle: string;
  workflowSlug: string;
}

export function BreadcrumbSchema({ workflowTitle, workflowSlug }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://prompt-finder.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Workflows',
        item: 'https://prompt-finder.com/workflows',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: workflowTitle,
        item: `https://prompt-finder.com/workflows/${workflowSlug}`,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

