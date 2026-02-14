# Clarity 3 to Clarity 4 Migration Guide

## Breaking Changes

### Removed Features
- `as-contract`: No longer supported in Clarity 4
- Use trait-based patterns instead

### Recommended Patterns

#### Before (Clarity 3):
```clarity
(as-contract (stx-transfer? amount tx-sender recipient))
```

#### After (Clarity 4):
```clarity
(try! (stx-transfer? amount (as-contract tx-sender) recipient))
```

## Testing

Ensure all contracts are tested with:
- clarity_version = 4
- epoch = "3.3"

## Resources
- [Clarity 4 Documentation](https://docs.stacks.co)
