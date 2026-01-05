export interface ProfileOption {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
  showChevron?: boolean;
  variant?: 'default' | 'danger';
}


