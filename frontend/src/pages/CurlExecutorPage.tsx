import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider
} from '@mui/material';
import { PlayArrow as PlayIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import axios from 'axios';

interface CurlResponse {
  status: number;
  headers: Record<string, string>;
  data: any;
  error?: string;
}

const CurlExecutorPage: React.FC = () => {
  const [curlCommand, setCurlCommand] = useState('');
  const [response, setResponse] = useState<CurlResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exampleCurl = `curl -X POST "https://api.vapi.ai/credential" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 235d6aa2-3ee9-494e-98ac" \
  -d '{
    "provider": "byo-sip-trunk",
    "name": "zpro_teste_ip_tcp_2",
    "gateways": [{
      "ip": "141.11.73.93",
      "outboundProtocol":"tcp"
    }],
    "outboundLeadingPlusEnabled": true,
    "outboundAuthenticationPlan": {
      "authUsername": "authUsername",
      "authPassword": "authPassword",
	  "sipRegisterPlan":{
         "domain":"141.11.73.93",
         "username":"username",
         "realm":"sipv2.wavoip.com"
      }
    }
  }'`;

  const exampleElevenLabsCurl = `curl -X POST https://api.elevenlabs.io/v1/convai/phone-numbers \\
     -H "xi-api-key: sk_b3d5474dc060309771893740688d96e123qewd123qewd" \\
     -H "Content-Type: application/json" \\
     -d '{
  "phone_number": "+553588754197",
  "label": "ZDG",
  "supports_inbound": true,
  "supports_outbound": true,
  "provider": "sip_trunk",
  "outbound_trunk_config": {
    "address": "sipv2.wavoip.com",
    "transport": "tcp",
    "media_encryption": "allowed",
    "credentials": {
      "username": "K797a2g2df7a7",
      "password": "A96d4h9d520de"
    }
  },
  "inbound_trunk_config": {
    "allowed_addresses": null,
    "allowed_numbers": null,
    "media_encryption": "allowed"
  }
}'`;

  const loadExample = () => {
    setCurlCommand(exampleCurl);
    setResponse(null);
    setError(null);
  };

  const loadElevenLabsExample = () => {
    setCurlCommand(exampleElevenLabsCurl);
    setResponse(null);
    setError(null);
  };

  const parseCurlCommand = (curl: string) => {
    try {
      // Remove 'curl' do início
      let command = curl.trim();
      if (command.startsWith('curl')) {
        command = command.substring(4).trim();
      }

      // Extrair método HTTP
      let method = 'GET';
      if (command.includes('-X POST')) {
        method = 'POST';
        command = command.replace('-X POST', '').trim();
      } else if (command.includes('-X PUT')) {
        method = 'PUT';
        command = command.replace('-X PUT', '').trim();
      } else if (command.includes('-X DELETE')) {
        method = 'DELETE';
        command = command.replace('-X DELETE', '').trim();
      } else if (command.includes('-X PATCH')) {
        method = 'PATCH';
        command = command.replace('-X PATCH', '').trim();
      }

      // Extrair URL
      const urlMatch = command.match(/"([^"]+)"/);
      if (!urlMatch) {
        throw new Error('URL não encontrada no comando curl');
      }
      const url = urlMatch[1];

      // Extrair headers
      const headers: Record<string, string> = {};
      const headerRegex = /-H "([^:]+): ([^"]+)"/g;
      let headerMatch;
      while ((headerMatch = headerRegex.exec(command)) !== null) {
        headers[headerMatch[1]] = headerMatch[2];
      }

      // Extrair body data
      let body = null;
      const dataMatch = command.match(/-d '([^']+)'/);
      if (dataMatch) {
        try {
          body = JSON.parse(dataMatch[1]);
        } catch {
          body = dataMatch[1];
        }
      }

      return { method, url, headers, body };
    } catch (err) {
      throw new Error(`Erro ao analisar comando curl: ${err}`);
    }
  };

  const executeCurl = async () => {
    if (!curlCommand.trim()) {
      setError('Por favor, insira um comando curl');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const { method, url, headers, body } = parseCurlCommand(curlCommand);

      const response = await axios.post('/api/curl-executor', {
        method,
        url,
        headers,
        body
      });

      setResponse(response.data);
    } catch (err: any) {
      setError(`Erro: ${err.response?.data?.error || err.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (data: any): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ color: '#e9edef', mb: 3, fontWeight: 600 }}>
        Executor de Curl
      </Typography>

      <Paper
        sx={{
          bgcolor: '#1e2428',
          color: '#e9edef',
          p: 3,
          mb: 3,
          border: '1px solid #374045'
        }}
      >
        <Typography variant="h6" sx={{ color: '#e9edef', mb: 2, fontWeight: 600 }}>
          Comando Curl
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="outlined"
            onClick={loadExample}
            sx={{
              borderColor: '#00a884',
              color: '#00a884',
              '&:hover': {
                borderColor: '#128C7E',
                color: '#128C7E',
              },
            }}
          >
            Exemplo Vapi
          </Button>
          <Button
            variant="outlined"
            onClick={loadElevenLabsExample}
            sx={{
              borderColor: '#ff6b35',
              color: '#ff6b35',
              '&:hover': {
                borderColor: '#e55a2b',
                color: '#e55a2b',
              },
            }}
          >
            Exemplo ElevenLabs
          </Button>
        </Box>
        
        <TextField
          fullWidth
          multiline
          rows={6}
          value={curlCommand}
          onChange={(e) => setCurlCommand(e.target.value)}
          placeholder="Cole seu comando curl aqui..."
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              color: '#e9edef',
              '& fieldset': {
                borderColor: '#374045',
              },
              '&:hover fieldset': {
                borderColor: '#00a884',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00a884',
              },
            },
            '& .MuiInputBase-input': {
              fontFamily: 'monospace',
              fontSize: 14,
            },
          }}
        />

        <Button
          variant="contained"
          onClick={executeCurl}
          disabled={loading || !curlCommand.trim()}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayIcon />}
          sx={{
            bgcolor: '#00a884',
            color: '#ffffff',
            '&:hover': {
              bgcolor: '#128C7E',
            },
            '&:disabled': {
              bgcolor: '#374045',
              color: '#8696a0',
            },
          }}
        >
          {loading ? 'Executando...' : 'Executar Curl'}
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, bgcolor: '#2d1b1b', color: '#f44336' }}>
          {error}
        </Alert>
      )}

      {response && (
        <Paper
          sx={{
            bgcolor: '#1e2428',
            color: '#e9edef',
            p: 3,
            border: '1px solid #374045'
          }}
        >
          <Typography variant="h6" sx={{ color: '#e9edef', mb: 2, fontWeight: 600 }}>
            Resposta
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Chip
              label={`Status: ${response.status}`}
              color={response.status >= 200 && response.status < 300 ? 'success' : 'error'}
              sx={{ mr: 1 }}
            />
            {response.error && (
              <Chip
                label="Erro"
                color="error"
                sx={{ mr: 1 }}
              />
            )}
          </Box>

          <Accordion sx={{ bgcolor: '#2a2f34', color: '#e9edef', mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#e9edef' }} />}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Headers da Resposta
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={formatResponse(response.headers)}
                InputProps={{
                  readOnly: true,
                  sx: {
                    color: '#e9edef',
                    fontFamily: 'monospace',
                    fontSize: 12,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#374045',
                    },
                  },
                }}
              />
            </AccordionDetails>
          </Accordion>

          <Divider sx={{ my: 2, borderColor: '#374045' }} />

          <Typography variant="subtitle1" sx={{ color: '#e9edef', mb: 2, fontWeight: 600 }}>
            Dados da Resposta
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={12}
            value={formatResponse(response.data)}
            InputProps={{
              readOnly: true,
              sx: {
                color: '#e9edef',
                fontFamily: 'monospace',
                fontSize: 12,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#374045',
                },
              },
            }}
          />
        </Paper>
      )}
    </Container>
  );
};

export default CurlExecutorPage; 