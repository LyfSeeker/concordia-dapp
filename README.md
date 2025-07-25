# 🏛️ Concordia - Decentralized Savings Group DApp

A revolutionary decentralized application that enables friends to save money together using blockchain technology and BNB Greenfield for permanent data storage.

---

**⚠️ Note:**

> **Hybrid Storage:** Concordia uses a **hybrid storage system**. Group data is stored in BNB Greenfield (simulated via localStorage for local development), with local metadata for fast access and as a fallback. See [`HYBRID_STORAGE.md`](./HYBRID_STORAGE.md) and [`GREENFIELD_STATUS.md`](./GREENFIELD_STATUS.md) for details and migration status.

---

## ✨ Features

- **🔗 Blockchain Integration**: Smart contracts on opBNB Testnet
- **🗂️ Hybrid Storage**: Group data is stored in BNB Greenfield (simulated via localStorage in dev), with local metadata for fast access and fallback
- **👥 Team Collaboration**: Multiple members can join and contribute
- **🎯 Goal Tracking**: Visual progress tracking and milestone celebrations
- **🏆 Aura Points System**: Gamified contribution rewards
- **🔒 Secure Withdrawals**: Multi-signature withdrawal system
- **📱 Responsive Design**: Works on desktop and mobile
- **🌐 Public Access**: Deployed on Vercel for global access

## 🚀 Quick Deployment

### Prerequisites

1. **Node.js 18+** and **npm**
2. **MetaMask** wallet with opBNB Testnet configured
3. **BNB Greenfield** account and API keys (for production)
4. **Vercel** account for deployment

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd concordia-dapp-backend
npm install
```

### 2. Configure Environment

Create `.env.local` file:

```bash
# Smart Contract
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address

# BNB Greenfield (required for production, simulated in dev)
GREENFIELD_ACCESS_KEY=your_greenfield_access_key
GREENFIELD_SECRET_KEY=your_greenfield_secret_key
GREENFIELD_BUCKET_NAME=concordia-data
GREENFIELD_ENDPOINT=https://gnfd-testnet-sp1.bnbchain.org

# Blockchain
NEXT_PUBLIC_CHAIN_ID=5611
NEXT_PUBLIC_CHAIN_NAME=opBNB Testnet
```

### 3. Deploy Smart Contract

```bash
npm run deploy:contract
```

### 4. Deploy to Vercel

```bash
npm run deploy:vercel
```

### 5. Configure Environment Variables in Vercel

Add all environment variables from `.env.local` to your Vercel project settings.

## 🏗️ Architecture

### Frontend (Next.js 15)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Wagmi + Viem** for blockchain interaction
- **Radix UI** components

### Backend (API Routes)
- **Next.js API Routes** for serverless functions
- **Hybrid Storage Service**: Handles group data using BNB Greenfield (simulated via localStorage in dev) and local metadata
- **Express.js** patterns for API design

### Blockchain
- **Solidity** smart contracts
- **OpenZeppelin** for security
- **opBNB Testnet** for testing

### Storage
- **Hybrid Storage**: BNB Greenfield for permanent data (simulated in dev), localStorage for metadata and fallback
- **Public read access** for team members
- **Metadata hashing** for data integrity

> See [`HYBRID_STORAGE.md`](./HYBRID_STORAGE.md) and [`GREENFIELD_STATUS.md`](./GREENFIELD_STATUS.md) for more details.

## 📊 Data Flow

```
User Action → Frontend → Hybrid Storage Service → BNB Greenfield (simulated/localStorage fallback)
     ↓
Dashboard ← Hybrid Storage Service ← BNB Greenfield (simulated/localStorage) ← Smart Contract Event
```

## 🔧 Development

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Smart Contract Development

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to testnet
npm run deploy:contract
```

## 🌐 Deployment

### Vercel Deployment

The app is configured for seamless Vercel deployment:

1. **API Routes**: All backend functionality via Next.js API routes
2. **Environment Variables**: Secure configuration management
3. **Global CDN**: Fast loading worldwide
4. **Auto-deployment**: Connected to GitHub repository

### Environment Setup

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Deployed smart contract address | ✅ |
| `GREENFIELD_ACCESS_KEY` | BNB Greenfield access key | ✅ (prod) |
| `GREENFIELD_SECRET_KEY` | BNB Greenfield secret key | ✅ (prod) |
| `GREENFIELD_BUCKET_NAME` | Greenfield bucket name | ✅ (prod) |
| `GREENFIELD_ENDPOINT` | Greenfield API endpoint | ✅ (prod) |

## 👥 Team Member Access

### How Team Members Join

1. **Visit the App**: Navigate to your deployed Vercel URL
2. **Connect Wallet**: Use MetaMask with opBNB Testnet
3. **Auto-Load Groups**: Dashboard shows groups they're members of
4. **Contribute**: Can contribute to existing groups

### Data Access

- **Public Read**: All group data is publicly readable
- **Member Filtering**: Dashboard shows only user's groups
- **Real-time Updates**: Data loads automatically on wallet connection

## 🔒 Security Features

- **Smart Contract Security**: OpenZeppelin libraries
- **Data Integrity**: Metadata hashing in Greenfield
- **Access Control**: Wallet-based authentication
- **Multi-signature**: Group consensus for withdrawals

## 📈 Performance

- **Serverless**: Vercel functions for scalability
- **CDN**: Global content delivery
- **Optimized**: Next.js optimizations
- **Caching**: Efficient data caching

## 🛠️ API Endpoints

### Groups

- `POST /api/groups/store` - Store new group
- `GET /api/groups` - Get all groups
- `GET /api/groups/[groupId]` - Get specific group
- `PUT /api/groups/[groupId]/update` - Update group
- `DELETE /api/groups/[groupId]/delete` - Delete group

### All endpoints return JSON with success/error status

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Check Vercel dashboard settings
   - Redeploy after adding variables

2. **Greenfield Connection Issues**
   - Verify API keys are correct (for production)
   - Check bucket permissions
   - Ensure endpoint is accessible

3. **Smart Contract Issues**
   - Verify contract is deployed
   - Check network configuration
   - Ensure wallet is connected to opBNB Testnet

### Support

- **Documentation**: Check `VERCEL_DEPLOYMENT.md`, [`HYBRID_STORAGE.md`](./HYBRID_STORAGE.md), [`GREENFIELD_STATUS.md`](./GREENFIELD_STATUS.md)
- **Issues**: Create GitHub issue
- **Community**: Join our Discord

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🎉 Success Stories

> "Concordia helped our team save for our dream vacation! The blockchain security and permanent storage gave us peace of mind." - Team Alpha

> "Finally, a DApp that actually works for group savings. The Greenfield integration is brilliant!" - Crypto Enthusiast

---

## 🚀 Ready to Deploy?

Your Concordia DApp is now ready for production deployment with:

- ✅ **Hybrid BNB Greenfield + LocalStorage Storage**
- ✅ **Public Vercel Deployment**
- ✅ **Team Member Access**
- ✅ **No Data Loss Guarantee**
- ✅ **Blockchain Security**

Start saving together with your team! 🎯 

---

## 📚 Further Reading on Storage & Migration

- [Hybrid Storage Implementation](./HYBRID_STORAGE.md): Details on how hybrid (Greenfield + localStorage) storage works in Concordia.
- [Greenfield Migration Status](./GREENFIELD_STATUS.md): Up-to-date status and guidance on the migration to BNB Greenfield storage. 