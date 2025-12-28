import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { Input } from '../../../../../../shared/components/Input';
import { Button } from '../../../../../../shared/components/Button';
import { Loading } from '../../../../../../shared/components/Loading';
import { useCreateTransaction } from '../hooks/use-create-transaction';
import { useCompanies } from '../hooks/use-companies';
import { TransactionType, Company, CreateTransactionRequest } from '../types/transaction.types';
import { colors } from '../../../../../../shared/theme/colors';
import { typography } from '../../../../../../shared/theme/typography';
import { spacing } from '../../../../../../shared/theme/spacing';

export function AddTransactionScreen() {
  const [type, setType] = useState<TransactionType>(TransactionType.GAIN);
  const [companyId, setCompanyId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [paid, setPaid] = useState<boolean>(false);
  const [recordDate, setRecordDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [errors, setErrors] = useState<{
    companyId?: string;
    amount?: string;
    recordDate?: string;
  }>({});
  const [showCompanyPicker, setShowCompanyPicker] = useState(false);

  const { data: companies, isLoading: isLoadingCompanies } = useCompanies();
  const createTransactionMutation = useCreateTransaction();

  // Initialize recordDate with today's date in Brazilian format
  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    setRecordDate(`${day}/${month}/${year}`);
  }, []);

  // Format date as Brazilian format (DD/MM/YYYY) with automatic slashes
  const formatDate = (value: string): string => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    if (!numericValue) return '';
    
    // Limit to 8 digits (DDMMYYYY)
    const limitedValue = numericValue.slice(0, 8);
    
    // Add slashes automatically
    if (limitedValue.length <= 2) {
      return limitedValue;
    } else if (limitedValue.length <= 4) {
      return `${limitedValue.slice(0, 2)}/${limitedValue.slice(2)}`;
    } else {
      return `${limitedValue.slice(0, 2)}/${limitedValue.slice(2, 4)}/${limitedValue.slice(4)}`;
    }
  };

  // Convert Brazilian date (DD/MM/YYYY) to ISO format (YYYY-MM-DD)
  const convertToISO = (brazilianDate: string): string | null => {
    const parts = brazilianDate.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      if (day.length === 2 && month.length === 2 && year.length === 4) {
        return `${year}-${month}-${day}`;
      }
    }
    return null;
  };

  const handleDateChange = (text: string) => {
    const formatted = formatDate(text);
    setRecordDate(formatted);
    if (errors.recordDate) {
      setErrors({ ...errors, recordDate: undefined });
    }
  };

  // Format amount as currency
  const formatCurrency = (value: string): string => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    if (!numericValue) return '';
    
    // Convert to number and divide by 100 to get decimal value
    const numberValue = Number(numericValue) / 100;
    
    // Format as BRL currency
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(numberValue);
  };

  const handleAmountChange = (text: string) => {
    const formatted = formatCurrency(text);
    setAmount(formatted);
    if (errors.amount) {
      setErrors({ ...errors, amount: undefined });
    }
  };

  const getNumericAmount = (): number => {
    const numericValue = amount.replace(/\D/g, '');
    if (!numericValue) return 0;
    return Number(numericValue) / 100;
  };

  const validate = (): boolean => {
    const newErrors: { companyId?: string; amount?: string; recordDate?: string } = {};

    if (!companyId) {
      newErrors.companyId = 'Empresa é obrigatória';
    }

    const numericAmount = getNumericAmount();
    if (numericAmount <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    }

    if (!recordDate) {
      newErrors.recordDate = 'Data é obrigatória';
    } else {
      // Validate Brazilian date format (DD/MM/YYYY)
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dateRegex.test(recordDate)) {
        newErrors.recordDate = 'Data inválida. Use o formato DD/MM/AAAA';
      } else {
        // Validate if date is valid
        const isoDate = convertToISO(recordDate);
        if (!isoDate) {
          newErrors.recordDate = 'Data inválida';
        } else {
          const date = new Date(isoDate);
          if (isNaN(date.getTime())) {
            newErrors.recordDate = 'Data inválida';
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    try {
      // Convert Brazilian date to ISO format
      const isoDate = convertToISO(recordDate);
      if (!isoDate) {
        setErrors({ ...errors, recordDate: 'Data inválida' });
        return;
      }

      const transactionData: CreateTransactionRequest = {
        type,
        companyId,
        amount: getNumericAmount(),
        paid,
        recordDate: isoDate,
        note: note.trim() || undefined,
      };

      await createTransactionMutation.mutateAsync(transactionData);

      // Reset form
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = today.getFullYear();
      setType(TransactionType.GAIN);
      setCompanyId('');
      setAmount('');
      setPaid(false);
      setRecordDate(`${day}/${month}/${year}`);
      setNote('');
      setErrors({});

      Alert.alert('Sucesso', 'Transação criada com sucesso!');
    } catch (error: unknown) {
      let errorMessage = 'Erro ao criar transação. Tente novamente.';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }
      
      Alert.alert('Erro', errorMessage);
    }
  };

  const selectedCompany = companies?.find((c) => c.id === companyId);

  if (isLoadingCompanies) {
    return (
      <View style={styles.loadingContainer}>
        <Loading />
      </View>
    );
  }

  if (!companies || companies.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Você não possui empresas cadastradas.
          </Text>
          <Text style={styles.emptySubtext}>
            Crie uma empresa para começar a adicionar transações.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Nova Transação</Text>

          {/* Type Toggle */}
          <View style={styles.section}>
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleOption,
                  type === TransactionType.GAIN && styles.toggleOptionActive,
                ]}
                onPress={() => setType(TransactionType.GAIN)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    type === TransactionType.GAIN && styles.toggleTextActive,
                  ]}
                >
                  Ganho
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleOption,
                  type === TransactionType.EXPENSE && styles.toggleOptionActive,
                ]}
                onPress={() => setType(TransactionType.EXPENSE)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    type === TransactionType.EXPENSE && styles.toggleTextActive,
                  ]}
                >
                  Despesa
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Company Picker */}
          <View style={styles.section}>
            <TouchableOpacity
              onPress={() => setShowCompanyPicker(true)}
              style={[
                styles.pickerButton,
                errors.companyId && styles.pickerButtonError,
              ]}
            >
              <Text
                style={[
                  styles.pickerButtonText,
                  !selectedCompany && styles.pickerButtonPlaceholder,
                ]}
              >
                {selectedCompany ? selectedCompany.name : 'Selecione uma empresa'}
              </Text>
              <Text style={styles.pickerButtonIcon}>▼</Text>
            </TouchableOpacity>
            {errors.companyId && (
              <Text style={styles.errorText}>{errors.companyId}</Text>
            )}
          </View>

          {/* Amount Input */}
          <View style={styles.section}>
            <Input
              label="Valor"
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="R$ 0,00"
              keyboardType="numeric"
              error={errors.amount}
            />
          </View>

          {/* Date Input */}
          <View style={styles.section}>
            <Input
              label="Data"
              value={recordDate}
              onChangeText={handleDateChange}
              placeholder="DD/MM/AAAA"
              keyboardType="numeric"
              maxLength={10}
              error={errors.recordDate}
            />
          </View>

          {/* Paid Toggle - Only show for GAIN */}
          {type === TransactionType.GAIN && (
            <View style={styles.section}>
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Você recebeu o dinheiro?</Text>
                <Switch
                  value={paid}
                  onValueChange={setPaid}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.text}
                />
              </View>
            </View>
          )}

          {/* Note Input */}
          <View style={styles.section}>
            <Input
              label="Observação (opcional)"
              value={note}
              onChangeText={setNote}
              placeholder="Adicione uma observação..."
              multiline
              numberOfLines={3}
              style={styles.noteInput}
            />
          </View>

          {/* Submit Button */}
          <Button
            title="Salvar"
            onPress={handleSubmit}
            loading={createTransactionMutation.isPending}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>

      {/* Company Picker Modal */}
      <Modal
        visible={showCompanyPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCompanyPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione uma empresa</Text>
              <TouchableOpacity
                onPress={() => setShowCompanyPicker(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={companies}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setCompanyId(item.id);
                    setShowCompanyPicker(false);
                    if (errors.companyId) {
                      setErrors({ ...errors, companyId: undefined });
                    }
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl + spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    padding: 4,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 6,
    alignItems: 'center',
  },
  toggleOptionActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    ...typography.button,
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.background,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  pickerButtonError: {
    borderColor: colors.error,
  },
  pickerButtonText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  pickerButtonPlaceholder: {
    color: colors.textSecondary,
  },
  pickerButtonIcon: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  switchLabel: {
    ...typography.body,
    color: colors.text,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: spacing.lg,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
    paddingBottom: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
  },
  modalCloseButton: {
    padding: spacing.xs,
  },
  modalCloseText: {
    ...typography.h2,
    color: colors.textSecondary,
  },
  modalItem: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalItemText: {
    ...typography.body,
    color: colors.text,
  },
});

