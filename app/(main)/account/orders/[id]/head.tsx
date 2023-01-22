export default async function Head({
  params: { id },
}: {
  params: { id: string };
}) {
  const title = `Order #${id} - Ecommerce Platform`;

  return (
    <>
      <title>{title}</title>
    </>
  );
}
