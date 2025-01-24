# Snapzion

<p align="center">
  An open source project that can generate high-quality images using Image AI models. Unlimited images per day. No rate limits.
</p>

## Tech Stack

- Image Generator
- Next.js app router with TailwindCSS

## Features

- Completely free to use with no rate limit.
- Generate up to 1,000 images per day effortlessly.
- Built using Next.js and TailwindCSS for a seamless experience.
- Leverages powerful Image AI models to create stunning visuals in seconds.
- Open source and community-driven. Your support and shares are highly appreciated.

## Support Us

If you love Snapzion and want to help us continue improving and upgrading our servers, consider sponsoring us on GitHub. Your contributions will ensure that we can keep delivering this powerful tool to the community.

```
docker run -p 3000:3000 \
    -e OPENAI_BASE_URL="your_openai_base_url" \
    -e OPENAI_API_KEY="your_openai_api_key" \
    -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key" \
    -e CLERK_SECRET_KEY="your_clerk_secret_key" \
    -e CONVEX_DEPLOYMENT="your_convex_deployment" \
    -e NEXT_PUBLIC_CONVEX_URL="your_next_public_convex_url" \
    snapzion-app
```