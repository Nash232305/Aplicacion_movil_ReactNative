import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SectionList
} from 'react-native';
import * as Contacts from 'expo-contacts';
import { Ionicons } from '@expo/vector-icons';



interface ContactsScreenProps {
  navigation: any;
}

interface PhoneNumber {
    number: string;
  }
  
  interface Contact {
    id: string;
    name: string;
    phoneNumbers: PhoneNumber[]; 
  }
  

const ContactsScreen: React.FC<ContactsScreenProps> = ({ navigation }) => {
  const [contacts, setContacts] = useState<{ title: string; data: Contact[] }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allContacts, setAllContacts] = useState<{ title: string; data: Contact[] }[]>([]);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });
  
      const groupedContacts = data.reduce((acc: Record<string, Contact[]>, contact) => {
        // Verificar que el contacto tiene un nombre y al menos un número de teléfono
        if (contact.name && contact.phoneNumbers && contact.phoneNumbers.length > 0) {
          const formattedContact: Contact = {
            id: contact.id || '', 
            name: contact.name,
            phoneNumbers: contact.phoneNumbers as PhoneNumber[], 
          };
  
          const firstLetter = contact.name[0].toUpperCase();
          if (!acc[firstLetter]) {
            acc[firstLetter] = [];
          }
          acc[firstLetter].push(formattedContact);
        }
        return acc;
      }, {});
  
      const sections = Object.keys(groupedContacts)
        .sort()
        .map(letter => ({
          title: letter,
          data: groupedContacts[letter],
        }));
  
      setContacts(sections);
      setAllContacts(sections); 
    }
  };
  
  const filterContacts = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = allContacts
        .map(section => ({
          ...section,
          data: section.data.filter(contact =>
            contact.name.toLowerCase().includes(query.toLowerCase()) ||
            (contact.phoneNumbers && contact.phoneNumbers[0]?.number.includes(query))
          ),
        }))
        .filter(section => section.data.length > 0);
      setContacts(filtered);
    } else {
      setContacts(allContacts);  
    }
  };

  const renderContactItem = ({ item }: { item: Contact }) => {
   
    const formatPhoneNumber = (number: string) => {
      const cleanedNumber = number.replace(/\D/g, '');
  
      if (cleanedNumber.startsWith('506') && cleanedNumber.length === 11) {
        return `+506 ${cleanedNumber.slice(3, 7)}-${cleanedNumber.slice(7)}`;
      }
      
      if (cleanedNumber.length === 8) {
        return `+506 ${cleanedNumber.slice(0, 4)}-${cleanedNumber.slice(4)}`;
      }
  
      return number;
    };
  
    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => {
          navigation.navigate('Transfer', {
            contact: {
              name: item.name,
              phoneNumber: item.phoneNumbers ? item.phoneNumbers[0].number : '',
              initials: item.name[0],
            },
          });
        }}
      >
        <View style={styles.contactIcon}>
          <Text style={styles.contactInitial}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          {item.phoneNumbers && (
            <Text style={styles.contactNumber}>
              {formatPhoneNumber(item.phoneNumbers[0].number)}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color="#4A90E2" />
      </TouchableOpacity>
    );
  };
  
  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.dividerLine} />
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.header}>Seleccioná un contacto</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#4A90E2" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Busca por nombre o número"
          value={searchQuery}
          onChangeText={filterContacts}
        />
      </View>
      <SectionList
        sections={contacts}
        keyExtractor={(item, index) => item.id + index}
        renderItem={renderContactItem}
        renderSectionHeader={renderSectionHeader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    flex: 1,
    marginRight: 24, 
    marginBottom: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchIcon: {
    position: 'absolute',
    left: 35,
    zIndex: 1,
  },
  searchInput: {
    height: 40,
    borderColor: '#e6e6e6',
    borderWidth: 1,
    paddingHorizontal: 40,
    borderRadius: 20,
    flex: 1,
    backgroundColor: 'white',
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginBottom: 10, 
  },
  dividerLine: {
    height: 1.5,
    backgroundColor: '#e6e6e6',
    marginBottom: 5, 
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactInitial: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  contactNumber: {
    fontSize: 14,
    color: '#A0A0A0', 
    fontWeight: '500', 
    marginTop: 2, 
  },
  
});

  
  
export default ContactsScreen;
