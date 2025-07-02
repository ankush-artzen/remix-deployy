import {
  reactExtension,
  useCartLines,
  useApplyCartLinesChange,
  BlockStack,
  Checkbox,
  Text,
  View,
} from '@shopify/ui-extensions-react/checkout';

const DONATION_VARIANT_ID = 'gid://shopify/ProductVariant/42852521934931';

export default reactExtension('purchase.checkout.block.render', () => <DonationBox />);

function DonationBox() {
  const applyCartLinesChange = useApplyCartLinesChange();
  const cartLines = useCartLines();

  const donationLine = cartLines.find(line => line.merchandise.id === DONATION_VARIANT_ID);
  const hasDonation = Boolean(donationLine);

  const handleChange = async (checked) => {
    try {
      if (checked && !hasDonation) {
        await applyCartLinesChange({
          type: 'addCartLine',
          merchandiseId: DONATION_VARIANT_ID,
          quantity: 1,
        });
      }

      if (!checked && hasDonation) {
        if (!donationLine || !donationLine.id) return;

        await applyCartLinesChange({
          type: 'updateCartLine',
          id: donationLine.id,
          quantity: 0,
        });
      }
    } catch (error) {
      console.error("❌ Error updating donation:", error);
    }
  };

  return (
    <View border="base" borderRadius="base" padding="base" background="surface">
      <BlockStack spacing="tight">
        <Text size="base" emphasis="bold">💖 Support a Cause</Text>
        <Text size="small" appearance="subdued">
          Your ₹10 donation helps support children’s education through our Foundation.
        </Text>
        <Checkbox
          id="donation"
          name="donation"
          checked={hasDonation}
          onChange={handleChange}
        >
          Add ₹10 to support our charity
        </Checkbox>
      </BlockStack>
    </View>
  );
}
