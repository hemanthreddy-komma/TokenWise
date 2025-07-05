# TokenWise - Real-Time Solana Wallet Intelligence

A comprehensive dashboard for monitoring and analyzing wallet behavior for specific tokens on the Solana blockchain.

## 🚀 Features

### Core Functionality
- **Top 60 Wallet Discovery**: Real-time tracking of the largest token holders
- **Live Transaction Monitoring**: Real-time buy/sell activity tracking
- **Protocol Identification**: Automatic detection of DEX protocols (Jupiter, Raydium, Orca)
- **Advanced Analytics**: Market trend analysis and wallet behavior insights
- **Historical Analysis**: Custom time-filtered queries with export capabilities

### Dashboard Features
- **Real-time Updates**: Live data feeds with WebSocket connections
- **Interactive Charts**: Price movements, volume analysis, and protocol breakdowns
- **Export Functionality**: CSV and JSON export options
- **Responsive Design**: Mobile-friendly interface
- **Dark/Light Mode**: Theme switching support

## 🛠 Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **UI Components**: shadcn/ui with Tailwind CSS
- **Charts**: Recharts for data visualization
- **Blockchain**: @solana/web3.js for Solana integration
- **State Management**: React hooks and context
- **Styling**: Tailwind CSS with custom design system

## 📦 Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-username/tokenwise.git
cd tokenwise
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Configure your Solana RPC endpoint in \`.env.local\`:
\`\`\`
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_TOKEN_ADDRESS=9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

## 🏗 Architecture

### Component Structure
\`\`\`
components/
├── ui/                 # shadcn/ui components
├── top-holders-table.tsx
├── transaction-feed.tsx
├── analytics-charts.tsx
├── protocol-breakdown.tsx
├── historical-analysis.tsx
└── export-dialog.tsx

lib/
├── solana-client.ts    # Blockchain integration
└── utils.ts           # Utility functions

hooks/
└── use-solana-monitor.ts # Custom hook for Solana data
\`\`\`

### Key Components

#### SolanaTokenMonitor
Core class handling blockchain interactions:
- Token holder discovery
- Real-time transaction monitoring
- Historical data queries
- Protocol identification

#### Dashboard Tabs
- **Overview**: Summary stats and recent activity
- **Top Holders**: Ranked list of token holders
- **Live Feed**: Real-time transaction stream
- **Analytics**: Advanced charts and insights
- **Historical**: Time-filtered analysis with exports

## 📊 Data Sources

### Real-time Data
- Solana RPC for blockchain queries
- WebSocket subscriptions for live updates
- Token account monitoring
- Transaction log parsing

### Analytics
- Price movement tracking
- Volume analysis
- Wallet activity patterns
- Protocol usage statistics

## 🔧 Configuration

### Token Configuration
Update the target token in \`lib/solana-client.ts\`:
\`\`\`typescript
const TOKEN_ADDRESS = 'YOUR_TOKEN_ADDRESS_HERE'
\`\`\`

### RPC Configuration
Configure your Solana RPC endpoint for optimal performance:
- Mainnet: \`https://api.mainnet-beta.solana.com\`
- Custom RPC: Use services like QuickNode or Alchemy for better performance

## 📈 Usage Examples

### Monitoring Top Holders
\`\`\`typescript
const { topHolders, isLoading } = useSolanaMonitor()

// Access top 60 holders with real-time updates
topHolders.forEach(holder => {
  console.log(\`Rank \${holder.rank}: \${holder.address} - \${holder.balance} tokens\`)
})
\`\`\`

### Real-time Transactions
\`\`\`typescript
const { recentTransactions } = useSolanaMonitor()

// Monitor live buy/sell activity
recentTransactions.forEach(tx => {
  console.log(\`\${tx.type.toUpperCase()}: \${tx.amount} tokens via \${tx.protocol}\`)
})
\`\`\`

### Historical Analysis
\`\`\`typescript
const { getHistoricalData } = useSolanaMonitor()

const data = await getHistoricalData(
  new Date('2024-01-01'),
  new Date('2024-01-31')
)
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Docker
\`\`\`bash
docker build -t tokenwise .
docker run -p 3000:3000 tokenwise
\`\`\`

## 🔮 Future Enhancements

### Planned Features
- **Multi-token Support**: Monitor multiple tokens simultaneously
- **Alert System**: Price and volume-based notifications
- **Advanced Filters**: Complex wallet behavior analysis
- **API Integration**: RESTful API for external access
- **Mobile App**: React Native companion app

### Technical Improvements
- **Database Integration**: PostgreSQL for historical data storage
- **Caching Layer**: Redis for improved performance
- **Rate Limiting**: API protection and optimization
- **WebSocket Scaling**: Support for more concurrent users

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For questions and support:
- Create an issue on GitHub
- Join our Telegram group
- Email: support@tokenwise.dev

## 🙏 Acknowledgments

- Solana Foundation for blockchain infrastructure
- shadcn/ui for component library
- Recharts for visualization components
- Next.js team for the framework
