#!/bin/bash

# Ensure the script is run with sudo
if [ "$EUID" -ne 0 ]; then
  echo "Please run with sudo: sudo $0"
  exit 1
fi

# Store the real username (not root)
REAL_USER=$(stat -f "%Su" /dev/console)
REAL_HOME=$(eval echo ~$REAL_USER)

# Define variables
CERTS_DIR="$REAL_HOME/certs"
DOMAIN="localhost.localdomain"
LABS_DOMAIN="labs.localhost.localdomain"
SUBDOMAINS=("auth" "open")
HOSTS_FILE="/etc/hosts"
BACKUP_FILE="/etc/hosts.bak.$(date +%Y%m%d%H%M%S)"

# Check if mkcert is installed
if ! command -v mkcert &> /dev/null; then
  echo "mkcert is not installed. Please install it with 'brew install mkcert' first."
  exit 1
fi

# Create backup of hosts file
echo "Creating backup of hosts file at $BACKUP_FILE"
cp "$HOSTS_FILE" "$BACKUP_FILE"

# Add entries to hosts file if they don't exist
if ! grep -q "$DOMAIN" "$HOSTS_FILE"; then
  echo "Adding entries to hosts file..."
  
  # Create entries for both IPv4 and IPv6
  printf "\n# Added by sdchi-platform monorepo for HTTPS setup script\n" >> "$HOSTS_FILE"
  
  # IPv4 entries
  printf "127.0.0.1 localhost %s %s\n" "$DOMAIN" "$LABS_DOMAIN" >> "$HOSTS_FILE"
  
  # Add all subdomains for IPv4
  for subdomain in "${SUBDOMAINS[@]}"; do
    printf "127.0.0.1 %s.%s %s.%s\n" "$subdomain" "$DOMAIN" "$subdomain" "$LABS_DOMAIN" >> "$HOSTS_FILE"
  done
  
  # IPv6 entries
  printf "::1 localhost %s %s\n" "$DOMAIN" "$LABS_DOMAIN" >> "$HOSTS_FILE"
  
  # Add all subdomains for IPv6
  for subdomain in "${SUBDOMAINS[@]}"; do
    printf "::1 %s.%s %s.%s\n" "$subdomain" "$DOMAIN" "$subdomain" "$LABS_DOMAIN" >> "$HOSTS_FILE"
  done
  
  echo "Hosts file updated successfully."
else
  echo "Entries for $DOMAIN already exist in hosts file."
fi

# Create certificates directory
mkdir -p "$CERTS_DIR"
chown "$REAL_USER" "$CERTS_DIR"

# Switch to the real user to run mkcert
echo "Generating certificates as user $REAL_USER..."
sudo -u "$REAL_USER" bash -c "
  # Install CA if needed
  mkcert -install
  
  # Generate certificates
  cd '$CERTS_DIR'
  mkcert '$DOMAIN' '*.$DOMAIN' '$LABS_DOMAIN' '*.$LABS_DOMAIN'
"

printf "\n=== Setup Complete ===\n"
echo "Certificates have been generated at $CERTS_DIR"
echo "Hosts file has been updated with domains and subdomains"
printf "\nYou can now access your services at:\n"
echo "Main domain: https://$DOMAIN"
for subdomain in "${SUBDOMAINS[@]}"; do
  echo "  https://$subdomain.$DOMAIN"
done
printf "\nLabs wildcard domain: https://$LABS_DOMAIN\n"
for subdomain in "${SUBDOMAINS[@]}"; do
  echo "  https://$subdomain.$LABS_DOMAIN"
done
echo "  https://[any-subdomain].$LABS_DOMAIN"
printf "\nCertificate files (for your server config):\n"
echo "  $CERTS_DIR/localhost.localdomain+3.pem (certificate)"
echo "  $CERTS_DIR/localhost.localdomain+3-key.pem (key)"
printf "\nA backup of your original hosts file is at $BACKUP_FILE\n"